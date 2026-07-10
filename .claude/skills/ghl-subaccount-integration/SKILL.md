---
name: ghl-subaccount-integration
description: >-
  Onboard a NEW GoHighLevel (GHL) sub-account to the SidingDepot-style
  site↔GHL integration, or debug an existing one. Use whenever the task
  involves connecting a website to a GHL location: wiring a Private
  Integration Token, discovering/creating a pipeline, creating the
  attribution custom fields, upserting contacts, creating/reading
  opportunities, or the submit-lead / ghl-webhook / ghl-status-sync paths.
  Triggers on: "conectar GHL", "nova subconta GHL", "integrar site com
  GoHighLevel", "pipeline GHL", "custom fields GHL", "lead form to GHL",
  "GHL opportunity", "leadconnectorhq".
---

# GHL Sub-account Integration

How to connect a website (SidingDepot-style, TanStack Start + Nitro) to a
GoHighLevel **location** (sub-account), and how to onboard the NEXT sub-account
without repeating past mistakes. The client code is **env-driven and
account-agnostic** — a new sub-account is an env swap plus a one-time setup run,
**never a code change**.

## Golden rules (read first)

1. **NEVER run write-tests against a client's PRODUCTION GHL location.** Create
   test contacts/opportunities/pipelines only in a **sandbox/test** sub-account.
   (We once ran the full suite against the real "Siding Depot LLC" location by
   mistake and left stray test records to clean up.)
2. **The reusable client (`src/lib/ghl-client.server.ts`) is never edited per
   account.** Everything account-specific lives in env vars. If you find
   yourself editing that file to onboard an account, stop — you're doing it wrong.
3. **`ensureCustomFields()` is idempotent and matches fields BY NAME**, not by
   re-deriving a slug from the key. GHL's `fieldKey` slug does NOT always match
   our short `key` (e.g. "Google Click ID (GCLID)" → fieldKey
   `google_click_id_gclid`, not `gclid`). Never match on fieldKey.
4. **Use `curl` for raw GHL API calls, NOT python `urllib`.** Python's default
   User-Agent gets Cloudflare-banned (`HTTP 403, error code 1010`). `curl` and
   the app's `fetch` are fine. Use python only to *build/parse* JSON, piped to curl.
5. **`locationId` is required in EVERY GHL v2 call** (query param or body).
   A location-scoped Private Integration Token (`pit-…`) can NOT list locations
   (`GET /locations/search` → 403) and has no "whoami" — you must get the
   locationId from the client.
6. **DO NOT define site endpoints as Nitro `server/api/*.post.ts` handlers.**
   This TanStack Start build does NOT scan the `server/api/` convention — such
   files silently never bundle and their routes 404 in production (a whole prior
   integration was dead because of this). The ONLY server pattern that works
   here is **`createServerFn`** from `@tanstack/react-start` in a
   `src/lib/*.functions.ts` file, called directly from client code (see
   `src/lib/ghl-lead.functions.ts` → `submitLeadToGhl` / `enrichGhlFromWidget`,
   used by `src/lib/leads.ts` and `GhlChatWidget.tsx`). The API key still stays
   server-side; the client import becomes an RPC stub.

## API basics

- Base URL: `https://services.leadconnectorhq.com`
- Headers on every call: `Authorization: Bearer <pit-token>`,
  `Version: 2021-07-28`, `Content-Type: application/json`
- Token type: **Private Integration Token** (`pit-…`), created in the
  sub-account under **Settings → Private Integrations**. It is location-scoped.

## Onboarding a NEW sub-account — step by step

### 1. Collect two things from the client (only these two are un-derivable)
- **PIT token** (`pit-…`) — Settings → Private Integrations.
- **locationId** — the `…/location/<ID>/…` segment of the GHL URL, or
  Settings → Business Info → "API Location ID". You CANNOT derive it from the token.

### 2. Verify the token + location
```bash
TOKEN="pit-…"; LOC="<locationId>"
H=(-H "Authorization: Bearer $TOKEN" -H "Version: 2021-07-28")
curl -s -w "\n%{http_code}\n" "${H[@]}" "https://services.leadconnectorhq.com/locations/$LOC"
```
Expect `200` + the location JSON. `403`/`401` = bad token; `422 LocationId can't
be undefined` on other endpoints just means you omitted the locationId.

### 3. Discover existing pipelines/stages
```bash
curl -s "${H[@]}" "https://services.leadconnectorhq.com/opportunities/pipelines?locationId=$LOC"
```
Decide: reuse an existing lead pipeline, or create one (next step).

### 4. Create the lead pipeline (if the account has none suitable)
The GHL v2 API **does** support pipeline creation: `POST /opportunities/pipelines`
with `{locationId, name, stages:[{name, position}]}`. Build the body with python,
POST with curl (Cloudflare rule #4):
```bash
python3 - "$LOC" > /tmp/pipe.json <<'PY'
import json,sys
loc=sys.argv[1]
stages=["New Lead 🚨","Contacted 📞","Track ⏱️","Scheduled 📅","Rescheduled 🔁","Trash lead 🗑️"]
print(json.dumps({"locationId":loc,"name":"1- LEADS PIPELINE",
  "stages":[{"name":n,"position":i} for i,n in enumerate(stages)]}))
PY
curl -s -w "\n%{http_code}\n" -X POST "${H[@]}" \
  --data-binary @/tmp/pipe.json \
  "https://services.leadconnectorhq.com/opportunities/pipelines"
```
Expect `201`. Grab the returned `pipeline.id` and the **New Lead** stage `id`.
(The canonical SidingDepot lead funnel is: New Lead 🚨 → Contacted 📞 → Track ⏱️
→ Scheduled 📅 → Rescheduled 🔁 → Trash lead 🗑️.)

### 5. Set the four env vars
In `sidingdepot-site/.env` (local) and in the Vercel project (production):
```
GHL_API_KEY="pit-…"
GHL_LOCATION_ID="<locationId>"
GHL_PIPELINE_ID="<pipeline id from step 3 or 4>"
GHL_PIPELINE_STAGE_ID="<the 'New Lead' stage id>"
```
These are the ONLY four values that change per account. `ghl-client.server.ts`
reads them via `getGhlConfig()`; if `GHL_API_KEY` or `GHL_LOCATION_ID` is missing
the whole integration degrades silently (leads still save to Supabase).

### 6. Create the 15 attribution custom fields + smoke-test the full flow
Run the harness (see "Verification harness" below). It calls
`ensureCustomFields()` (idempotent — creates only what's missing, safe to re-run),
then upsert/opportunity/read-back. Confirm all 15 field VALUES round-trip on the
contact, not just that the fields exist.

**Field grouping — "Lead Sourcing" folder:** the convention (set on the Siding
Depot account 2026-07-09) is to group these attribution fields under a GHL
custom-field folder named **"Lead Sourcing"**. `ensureCustomFields()` creates new
fields at ROOT and matches existing ones by NAME (not by folder), so grouping is
a manual/organizational step in the GHL UI and never breaks matching — but after
onboarding a new sub-account, move the created fields into a "Lead Sourcing"
folder to match the convention.

### 7. Apply the Supabase migration (only if using webhook / status-sync paths)
`supabase/migrations/20260709000000_add_ghl_sync_columns.sql` adds the `ghl_*`
columns (`ghl_contact_id`, `ghl_synced_at`, `opportunity_status`,
`pipeline_stage`, `opportunity_value`, `close_date`) to `leads`. It must be run
in the target Supabase project. Also set `SUPABASE_SERVICE_ROLE_KEY` (server-only)
for the webhook + status-sync tasks.

## The three site→GHL communication paths

| Path | File | GHL calls | Supabase? |
|---|---|---|---|
| Standard lead form | `server/api/submit-lead.post.ts` | `upsertContact` + `createOpportunity` | no |
| Floating chat widget | `server/api/ghl-webhook.post.ts` | `upsertContact` (enrich) | inserts `leads`, writes `ghl_contact_id` |
| Status sync (cron 15m) | `server/tasks/ghl-status-sync.ts` | `getOpportunity` + `getPipelineStageName` | reads/writes `leads` |

The single source of truth for the attribution field list and the internal→GHL
value mapping is `src/lib/ghl-attribution-fields.ts` (`ATTRIBUTION_FIELD_DEFS` +
`toCustomFieldValues`). Both the form and the widget send the identical payload.

## Client functions (`src/lib/ghl-client.server.ts`) — server-only

- `isGhlConfigured()` — true if API key + locationId present.
- `ensureCustomFields()` — idempotent create of the 15 fields, cached in-process.
- `upsertContact(input)` — create/update by phone/email, attaches attribution as
  custom fields. Returns `{id, new}`.
- `createOpportunity(input)` — no-op unless `GHL_PIPELINE_ID` + stage set.
- `getOpportunity(id)` — reads `{status, pipelineStageId, monetaryValue}`.
- `getPipelineStageName(stageId)` — resolves stage id → human name (cached).
- `addContactNote(contactId, body)` — attaches a free-text note.

## Bugs found in the past (don't reintroduce)

- Matching custom fields by fieldKey instead of by name (rule #3).
- Missing `locationId` in a query (e.g. pipelines lookup) → 422.
- Wrong query-param name on a GHL endpoint.
- Using python `urllib` for the POST → Cloudflare 1010 (rule #4).

## Verification harness

Use a throwaway script (git-ignored / deleted before commit — e.g.
`scripts/_test-ghl.ts`) that imports the REAL client and runs, in order:
`isGhlConfigured` → `ensureCustomFields` → `upsertContact` (twice, to prove
idempotency: same id, `new:false` on the 2nd) → `createOpportunity` →
`getOpportunity` → `getPipelineStageName` → `addContactNote`, then read the
contact back via `GET /contacts/<id>` and confirm all 15 field values. Run with
`bun scripts/_test-ghl.ts` (bun auto-loads `.env`). **Delete it before committing.**

## Testing the endpoints

- **GHL client logic** (contact/opp/fields): the `_test-ghl.ts` harness above is
  the fast, reliable proof — it hits the real GHL API through the real client.
- **`createServerFn` wiring**: you canNOT call a serverFn from a plain
  `bun` script — it throws `No Start context found in AsyncLocalStorage`. And
  `vite dev` doesn't run Nitro; `vite preview` fails on the vercel preset
  (`dist/server/server.js` missing). To confirm the RPC actually routes: after
  `bun run build`, check that the serverFn code landed in the server bundle
  (`grep -rl upsertContact .vercel/output/functions/__server.func/` — should hit
  `_ssr/ghl-lead.functions-*.mjs`; empty = the fn isn't bundled = broken). You
  can import the built `__server.func/index.mjs` handler and POST to
  `/_serverFn/<functionId>` — but the body must be seroval-encoded with header
  `x-tsr-serverFn: true` (plain JSON → HTTP 500 Seroval error). Reproducing that
  by hand is impractical; the definitive green-200 test is a **Vercel preview
  deploy** where the real browser client encodes the payload.
