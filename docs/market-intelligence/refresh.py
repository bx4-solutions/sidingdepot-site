#!/usr/bin/env python3
"""
Daily refresh for the market_intel knowledge base.

Re-pulls production GHL closings + Cobb County cadastre, recomputes every
aggregate, and writes kb_seed.json (from which seed.sql / data JSONs /
KNOWLEDGE-PACK.md are regenerated).

ENV REQUIRED:
  GHL_API_KEY_PROD   production GoHighLevel API key (the .env one is SANDBOX — do not use)
  GHL_LOCATION_ID    VPwAmJKkB62wR0BJhYil (production Siding Depot LLC)

Cobb cadastre is a public ArcGIS endpoint — no key needed.

Schedule: prefer Supabase pg_cron -> edge function running this logic; the Vercel
Hobby plan is already at its cron limit (see README).
"""
import json, os, re, sys, time, collections, statistics, urllib.request, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
GHL_KEY = os.environ.get("GHL_API_KEY_PROD")
GHL_LOC = os.environ.get("GHL_LOCATION_ID", "VPwAmJKkB62wR0BJhYil")
COBB = "https://gis.cobbcounty.gov/gisserver/rest/services/tax/taxassessorsdaily/MapServer"
COMP_HTML = os.path.join(HERE, "..", "competitive-research", "dr-roof-market-map.html")
CF = {"DUmUaVf5pqjKjUdhzQFf": "zip", "O8JOb8ENnek61UnHf8er": "city",
      "FXCxv8a1lmY6TIgq2woK": "siding", "G8avtemoWX6GsdAL0oOh": "year",
      "u3yDLAw54k9hVLDgzWBB": "heard", "rDM05VB5JQnk8N9YCSI4": "squares"}


def ghl_opps():
    if not GHL_KEY:
        sys.exit("ERRO: GHL_API_KEY_PROD nao definido. A chave do .env e a SANDBOX. Ver README.")
    out, start_after, start_id = [], None, None
    while True:
        q = {"status": "all", "limit": 100, "location_id": GHL_LOC}
        if start_after: q["startAfter"] = start_after; q["startAfterId"] = start_id
        req = urllib.request.Request(
            "https://services.leadconnectorhq.com/opportunities/search?" + urllib.parse.urlencode(q),
            headers={"Authorization": f"Bearer {GHL_KEY}", "Version": "2021-07-28", "Accept": "application/json"})
        d = json.loads(urllib.request.urlopen(req, timeout=60).read())
        opps = d.get("opportunities", [])
        out += opps
        meta = d.get("meta", {})
        if not meta.get("startAfterId") or not opps: break
        start_after, start_id = meta["startAfter"], meta["startAfterId"]
        time.sleep(0.1)
    rows = []
    for o in out:
        r = {"status": o.get("status"), "val": o.get("monetaryValue") or 0}
        for cf in (o.get("customFields") or []):
            k = CF.get(cf.get("id"))
            if k:
                v = cf.get("fieldValueString") or cf.get("fieldValueArray")
                if v: r[k] = v
        rows.append(r)
    return rows


def cobb_pull(layer, where, fields):
    out, off = [], 0
    while True:
        p = urllib.parse.urlencode({"where": where, "outFields": fields, "returnGeometry": "false",
                                    "resultOffset": off, "resultRecordCount": 1000, "f": "json"})
        for attempt in range(3):
            try:
                f = json.loads(urllib.request.urlopen(f"{COBB}/{layer}/query?{p}", timeout=60).read()).get("features", [])
                break
            except Exception as e:
                if attempt == 2:
                    raise RuntimeError(f"Cobb layer {layer} falhou 3x no offset {off}: {e}")
                time.sleep(2 * (attempt + 1))
        if not f: break
        out += [x["attributes"] for x in f]; off += 1000
        if len(f) < 1000: break
    return out


def sqnum(s):
    if not s: return None
    m = re.search(r"[\d.]+", str(s).replace(",", ""))
    return float(m.group()) if m else None


def build(rows, subs):
    def norm(c): return (c or "").strip().title()
    both = [(v, s) for r in rows if (v := r["val"]) > 0 and (s := sqnum(r.get("squares"))) and s > 0]
    PSQ = statistics.median([v / s for v, s in both]) if both else 1043
    neigh = []
    for x in subs:
        sq = (x["sqft"] or 2200) / 100 * 1.1
        t = round(sq * PSQ)
        neigh.append({"subdivision": x["sub"], "county": "Cobb", "homes_1980_1995": x["n"],
                      "median_sqft": x["sqft"], "median_bldg_value": x["fmv"], "median_year": x["yr"],
                      "est_ticket": t, "est_market_value": x["n"] * (x["fmv"] or 0),
                      "revenue_potential_3pct": round(x["n"] * 0.03 * t)})
    neigh.sort(key=lambda z: -z["homes_1980_1995"])
    C = collections.defaultdict(lambda: {"n": 0, "won": 0, "lost": 0, "vals": []})
    for r in rows:
        c = norm(r.get("city"))
        if not c: continue
        C[c]["n"] += 1
        if r["status"] == "won": C[c]["won"] += 1
        elif r["status"] == "lost": C[c]["lost"] += 1
        if r["status"] == "won" and r["val"] > 0: C[c]["vals"].append(r["val"])
    city = [{"city": c, "deals": d["n"], "won": d["won"], "lost": d["lost"],
             "close_rate": round(d["won"] / (d["won"] + d["lost"]) * 100) if d["won"] + d["lost"] else None,
             "ticket_median": round(statistics.median(d["vals"])) if d["vals"] else None,
             "ticket_mean": round(statistics.mean(d["vals"])) if d["vals"] else None}
            for c, d in C.items() if d["n"] >= 4]
    city.sort(key=lambda z: -(z["close_rate"] or 0))
    band = collections.defaultdict(list)
    for r in rows:
        v, s = r["val"], sqnum(r.get("squares"))
        if v > 0 and s and s > 0:
            b = "1-10" if s <= 10 else "11-20" if s <= 20 else "21-30" if s <= 30 else "30+"
            band[b].append((v, s))
    psize = [{"size_band_squares": b, "n": len(band[b]),
              "ticket_median": round(statistics.median([v for v, s in band[b]])),
              "price_per_square": round(statistics.median([v / s for v, s in band[b]]))}
             for b in ["1-10", "11-20", "21-30", "30+"] if band[b]]
    comp = []
    if os.path.exists(COMP_HTML):
        h = open(COMP_HTML, encoding="utf-8").read()
        for u in set(re.findall(r'https?://[^\s"<>]*exovations[^\s"<>]*', h)):
            m = re.search(r"/service-areas/([a-z-]+)-ga/([a-z-]+)", u)
            if m: comp.append(("EXOVATIONS", m.group(1), m.group(2)))
        for u in set(re.findall(r'https?://[^\s"<>]*drroof[^\s"<>]*', h)):
            m = re.search(r"drroof\.com/([a-z-]+)-ga/([a-z-]+)", u)
            if m and m.group(1) not in ("", "www"): comp.append(("Dr. Roof", m.group(1), m.group(2)))
    comp = [{"competitor": a, "city": b, "service": c} for a, b, c in sorted(set(comp))]
    ch = collections.Counter(str(r["heard"]).strip() for r in rows if r.get("heard"))
    channel = [{"source": k, "deals": v} for k, v in ch.most_common() if k and k != "None"]
    M = collections.defaultdict(lambda: {"won": 0, "lost": 0, "vals": []})
    for r in rows:
        s = r.get("siding")
        if not s: continue
        if r["status"] == "won": M[s]["won"] += 1
        elif r["status"] == "lost": M[s]["lost"] += 1
        if r["status"] == "won" and r["val"] > 0: M[s]["vals"].append(r["val"])
    material = [{"current_material": m, "won": d["won"], "lost": d["lost"],
                "close_rate": round(d["won"] / (d["won"] + d["lost"]) * 100) if d["won"] + d["lost"] else None,
                "ticket_mean": round(statistics.mean(d["vals"])) if d["vals"] else None}
               for m, d in M.items() if d["won"] + d["lost"] >= 3]
    material.sort(key=lambda z: -(z["won"] + z["lost"]))
    won = [r["val"] for r in rows if r["status"] == "won" and r["val"] > 0]
    meta = {"total_opps": len(rows), "cobb_homes": sum(x["n"] for x in subs),
            "cobb_neighborhoods": len(neigh), "psq_median": round(PSQ),
            "ticket_won_median": round(statistics.median(won)) if won else 0}
    return {"neighborhoods": neigh, "city_performance": city, "price_by_size": psize,
            "competitor_coverage": comp, "channel_mix": channel, "siding_material": material, "meta": meta}


def log_line(status, msg):
    """Append one line to refresh.log — the run history the council asked for."""
    stamp = time.strftime("%Y-%m-%dT%H:%M:%S")
    with open(os.path.join(HERE, "refresh.log"), "a") as fh:
        fh.write(f"{stamp} | {status} | {msg}\n")


def main():
    dry = "--dry-run" in sys.argv
    seed_path = os.path.join(HERE, "kb_seed.json")
    prev_meta = {}
    if os.path.exists(seed_path):
        try:
            prev_meta = json.load(open(seed_path)).get("meta", {})
        except Exception:
            prev_meta = {}
    try:
        print("1/3 GHL...", flush=True)
        rows = ghl_opps()
        print(f"  {len(rows)} oportunidades", flush=True)
        print("2/3 Cobb cadastre...", flush=True)
        SN = {s["SUBDIVNUM"]: (s.get("SUBDIVNAME") or "").strip()
              for s in cobb_pull(3, "1=1", "SUBDIVNUM,SUBDIVNAME") if s.get("SUBDIVNUM")}
        YB = {y["PIN"]: y for y in cobb_pull(5, "YRBLT>=1980 AND YRBLT<=1995 AND TAXYR=2026", "PIN,YRBLT,SQFT") if y.get("PIN")}
        agg = collections.defaultdict(lambda: {"n": 0, "fmv": [], "sqft": [], "yrs": []})
        for p in cobb_pull(0, "CLASS='R3'", "PIN,SUBDIVNUM,FMV_BLDG"):
            y = YB.get(p.get("PIN"))
            if not y: continue
            k = SN.get(p.get("SUBDIVNUM") or "", "")
            if not k: continue
            a = agg[k]; a["n"] += 1
            if p.get("FMV_BLDG"): a["fmv"].append(p["FMV_BLDG"])
            if y.get("SQFT"): a["sqft"].append(y["SQFT"])
            if y.get("YRBLT"): a["yrs"].append(y["YRBLT"])
        subs = [{"sub": k, "n": d["n"],
                 "fmv": round(statistics.median(d["fmv"])) if d["fmv"] else None,
                 "sqft": round(statistics.median(d["sqft"])) if d["sqft"] else None,
                 "yr": round(statistics.median(d["yrs"])) if d["yrs"] else None}
                for k, d in agg.items() if d["n"] >= 20]
        print(f"  {len(subs)} bairros", flush=True)
        print("3/3 recompute...", flush=True)
        kb = build(rows, subs)
    except Exception as e:
        # A pull failed after retries: log and LEAVE THE PREVIOUS kb_seed.json UNTOUCHED.
        log_line("FALHA", str(e))
        sys.exit(f"ABORTADO sem sobrescrever dados: {e}")

    # Sanity: an update that shrinks the base >20% is more likely a broken pull
    # than reality. Refuse to overwrite good data with a suspicious pull.
    for key, new_val in (("total_opps", kb["meta"]["total_opps"]),
                         ("cobb_neighborhoods", kb["meta"]["cobb_neighborhoods"])):
        old_val = prev_meta.get(key)
        if old_val and new_val < old_val * 0.8:
            log_line("REJEITADO", f"{key}: {old_val} -> {new_val} (queda >20%)")
            sys.exit(f"ABORTADO: {key} caiu de {old_val} para {new_val} (>20%). "
                     f"Se a queda for real, apague kb_seed.json e rode de novo.")

    if dry:
        print(f"DRY-RUN - nada gravado. Teria escrito: {kb['meta']}", flush=True)
        log_line("dry-run", str(kb["meta"]))
        return

    # Atomic write: temp file + rename, so a crash mid-write can't corrupt the seed.
    tmp = seed_path + ".tmp"
    json.dump(kb, open(tmp, "w"), ensure_ascii=False)
    os.replace(tmp, seed_path)
    log_line("ok", str(kb["meta"]))
    print(f"OK - {kb['meta']}", flush=True)


if __name__ == "__main__":
    main()
