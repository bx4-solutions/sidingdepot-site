// TanStack Start server functions for the two-sided Referral program.
//
// Page A (the referrer) submits → creates two linked contacts + an opportunity
// in the REFERRALS pipeline (handled by submitReferral, added next).
// Page B (the referred neighbor) opens a personalized welcome/sales page via an
// opaque Referral ID in the URL, then accepts → we complete their contact and
// advance the deal. This file powers Page B: getReferralByCode + acceptReferral.
//
// Server-only: the GHL key is read from env and never reaches the browser.
// Account-agnostic: custom fields are resolved BY NAME at runtime (same pattern
// as ghl-client.server.ts), so the exact field IDs differ per sub-account with
// no code change — only GHL_API_KEY / GHL_LOCATION_ID / GHL_REFERRAL_* env vars.
import { createServerFn } from "@tanstack/react-start";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

function cfg() {
  // O referral pode ter conta GHL propria (GHL_REFERRAL_API_KEY / GHL_REFERRAL_LOCATION_ID),
  // separada do fluxo de lead comum do site — cai de volta na conta padrao se nao definida.
  const apiKey = process.env.GHL_REFERRAL_API_KEY || process.env.GHL_API_KEY;
  const locationId = process.env.GHL_REFERRAL_LOCATION_ID || process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return null;
  return {
    apiKey,
    locationId,
    pipelineId: process.env.GHL_REFERRAL_PIPELINE_ID || null,
    stageSubmitted: process.env.GHL_REFERRAL_STAGE_SUBMITTED || null,
    stageAccepted: process.env.GHL_REFERRAL_STAGE_ACCEPTED || null,
  };
}

async function ghl<T = any>(path: string, key: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${GHL_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${key}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      console.error(`[referral] ${init.method || "GET"} ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[referral] ${init.method || "GET"} ${path} threw:`, err);
    return null;
  }
}

// Resolve the referral custom fields we need (by human name → field id).
let _fieldCache: Record<string, string> | null = null;
async function referralFieldIds(key: string, locationId: string): Promise<Record<string, string>> {
  if (_fieldCache) return _fieldCache;
  const existing = await ghl<{ customFields: Array<{ id: string; name: string }> }>(
    `/locations/${locationId}/customFields?model=contact`,
    key,
  );
  const byName: Record<string, string> = {};
  for (const f of existing?.customFields || []) byName[f.name] = f.id;
  _fieldCache = byName;
  return byName;
}

function first(name?: string | null): string {
  return (name || "").trim().split(/\s+/)[0] || "";
}

function last4(phone?: string | null): string {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : "";
}

export type ReferralInfo = {
  found: boolean;
  code: string;
  referrerName: string;
  referrerFirst: string;
  referrerPhoneLast4: string;
  referredFirst: string;
  contactId: string | null;
  opportunityId: string | null;
  // Serviços que o INDICADOR marcou na Page A — Page B pré-marca esses e permite
  // o vizinho acrescentar/alterar (múltipla escolha).
  services: string[];
};

/**
 * Page B loader: given the opaque Referral ID from the URL, look up who referred
 * whom so the welcome page can greet the neighbor by name. Always resolves (falls
 * back to a generic-but-warm welcome) so the page renders no matter what.
 */
export const getReferralByCode = createServerFn({ method: "GET" })
  .inputValidator((code: string) => code)
  .handler(async ({ data: code }): Promise<ReferralInfo> => {
    const fallback: ReferralInfo = {
      found: false,
      code,
      referrerName: "",
      referrerFirst: "",
      referrerPhoneLast4: "",
      referredFirst: "",
      contactId: null,
      opportunityId: null,
      services: [],
    };
    const c = cfg();
    if (!c || !code) return fallback;

    // The opportunity name carries the code ("Referral: Neighbor (by Referrer) — <code>").
    const search = await ghl<{
      opportunities: Array<{
        id: string;
        name: string;
        contactId?: string;
        contact?: { id: string };
      }>;
    }>(
      `/opportunities/search?location_id=${c.locationId}&q=${encodeURIComponent(code)}&limit=1`,
      c.apiKey,
    );
    const opp = search?.opportunities?.[0];
    if (!opp) return fallback;

    const contactId = opp.contactId || opp.contact?.id || null;
    let referrerName = "";
    let referrerPhone = "";
    let referredName = "";
    let services: string[] = [];

    if (contactId) {
      const contactRes = await ghl<{
        contact: {
          firstName?: string;
          lastName?: string;
          customFields?: Array<{ id: string; value: string }>;
        };
      }>(`/contacts/${contactId}`, c.apiKey);
      const contact = contactRes?.contact;
      referredName = `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim();
      const ids = await referralFieldIds(c.apiKey, c.locationId);
      const byName = (fieldName: string) => {
        const fid = ids[fieldName];
        if (!fid) return "";
        return (contact?.customFields || []).find((f) => f.id === fid)?.value || "";
      };
      referrerName = byName("Referred By Name");
      referrerPhone = byName("Referred By Phone");
      services = byName("Services")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    // Fall back to parsing the opportunity name if the field was empty.
    if (!referrerName) {
      const m = opp.name.match(/\(by ([^)]+)\)/i);
      if (m) referrerName = m[1].trim();
    }
    if (!referredName) {
      const m = opp.name.match(/Referral:\s*([^(—]+)/i);
      if (m) referredName = m[1].trim();
    }

    return {
      found: true,
      code,
      referrerName,
      referrerFirst: first(referrerName),
      referrerPhoneLast4: last4(referrerPhone),
      referredFirst: first(referredName),
      contactId,
      opportunityId: opp.id,
      services,
    };
  });

export type AcceptReferralInput = {
  code: string;
  contactId: string | null;
  opportunityId: string | null;
  email: string;
  address: string;
  services: string[];
};

/**
 * Page B accept: the neighbor confirms the referral and completes their details.
 * We fill in email/address/service on their contact and advance the deal from
 * "Submitted" to the accepted stage. Never throws — returns { ok }.
 */
export const acceptReferral = createServerFn({ method: "POST" })
  .inputValidator((data: AcceptReferralInput) => data)
  .handler(async ({ data }) => {
    const c = cfg();
    if (!c) return { ok: false as const, reason: "not-configured" };
    if (!data.contactId) return { ok: false as const, reason: "no-contact" };

    const ids = await referralFieldIds(c.apiKey, c.locationId);
    const customFields: Array<{ id: string; field_value: string }> = [];
    const push = (name: string, value?: string) => {
      const id = ids[name];
      // A missing field id used to fail silently, which hid the whole write.
      if (!id) return console.warn(`[referral] custom field "${name}" not found — skipped`);
      if (value) customFields.push({ id, field_value: value });
    };
    push("Referral Status", "Accepted by neighbor");
    // The services the neighbor confirms here (pre-checked from what the referrer
    // marked, plus any they add) — record them instead of dropping them.
    push("Services", data.services.join(", "));

    // Update the neighbor's contact with the details they just completed.
    await ghl(`/contacts/${data.contactId}`, c.apiKey, {
      method: "PUT",
      body: JSON.stringify({
        email: data.email || undefined,
        address1: data.address || undefined,
        customFields: customFields.length ? customFields : undefined,
      }),
    });

    // Advance the deal so the sales team sees an accepted referral.
    if (data.opportunityId && c.pipelineId && c.stageAccepted) {
      await ghl(`/opportunities/${data.opportunityId}`, c.apiKey, {
        method: "PUT",
        body: JSON.stringify({
          pipelineId: c.pipelineId,
          pipelineStageId: c.stageAccepted,
        }),
      });
    }

    return { ok: true as const };
  });

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = (full || "").trim().split(/\s+/);
  return { firstName: parts[0] || "Website", lastName: parts.slice(1).join(" ") };
}

/** Upsert a contact by phone/email, attaching referral custom fields by name. */
async function upsert(
  c: { apiKey: string; locationId: string },
  ids: Record<string, string>,
  input: {
    name: string;
    phone?: string;
    email?: string;
    city?: string;
    tags: string[];
    source: string;
    fields?: Record<string, string | undefined>;
  },
): Promise<string | null> {
  const { firstName, lastName } = splitName(input.name);
  const customFields: Array<{ id: string; field_value: string }> = [];
  for (const [fname, val] of Object.entries(input.fields || {})) {
    const id = ids[fname];
    if (id && val) customFields.push({ id, field_value: String(val) });
  }
  const res = await ghl<{ contact: { id: string } }>(`/contacts/upsert`, c.apiKey, {
    method: "POST",
    body: JSON.stringify({
      locationId: c.locationId,
      firstName,
      lastName,
      email: input.email || undefined,
      phone: input.phone || undefined,
      city: input.city || undefined,
      tags: input.tags,
      source: input.source,
      customFields,
    }),
  });
  return res?.contact?.id || null;
}

export type SubmitReferralInput = {
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
  homeownerName: string;
  homeownerPhone: string;
  homeownerEmail: string;
  cityOrZip: string;
  services: string[];
  permission: boolean;
  termsAccepted: boolean;
};

/** Looks up an existing contact by phone (then email). Returns its id, or null. */
async function findExistingContact(
  c: { apiKey: string; locationId: string },
  phone?: string,
  email?: string,
): Promise<string | null> {
  const tryLookup = async (qs: string) => {
    const res = await ghl<{ contact?: { id: string } | null }>(
      `/contacts/search/duplicate?locationId=${c.locationId}&${qs}`,
      c.apiKey,
    );
    return res?.contact?.id || null;
  };
  if (phone) {
    const byPhone = await tryLookup(`number=${encodeURIComponent(phone)}`);
    if (byPhone) return byPhone;
  }
  if (email) {
    const byEmail = await tryLookup(`email=${encodeURIComponent(email)}`);
    if (byEmail) return byEmail;
  }
  return null;
}

/** Adds tags to an existing contact without touching its other tags/fields. */
async function addTags(
  c: { apiKey: string; locationId: string },
  contactId: string,
  tags: string[],
): Promise<void> {
  await ghl(`/contacts/${contactId}/tags`, c.apiKey, {
    method: "POST",
    body: JSON.stringify({ tags }),
  });
}

/**
 * Page A submit (the referrer).
 *
 * CRM hygiene rules (set by the business owner):
 *  - The REFERRED neighbor is the only real lead: they get the contact AND the
 *    single card, created immediately on submit so the lead is never lost.
 *  - The REFERRER never gets a card and is never pushed into conversations.
 *      · already a contact/customer → we only ADD a tag ("indicou <neighbor>")
 *      · not in the CRM yet        → we create a bare contact, purely so the
 *        reward SMS/emails can reach them later. Nothing else.
 *
 * Never throws — returns { ok: false } so the UI can degrade gracefully.
 */
export const submitReferral = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitReferralInput) => data)
  .handler(async ({ data }) => {
    const c = cfg();
    if (!c || !c.pipelineId || !c.stageSubmitted) {
      return { ok: false as const, reason: "not-configured" };
    }
    const ids = await referralFieldIds(c.apiKey, c.locationId);
    const now = new Date();
    const code = `SD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`;

    // ── 1) The neighbor: contact + card FIRST, so the lead is never lost ──────
    const referredId = await upsert(c, ids, {
      name: data.homeownerName,
      phone: data.homeownerPhone,
      email: data.homeownerEmail,
      city: data.cityOrZip,
      // Tag "indicado por <indicador>" no proprio lead → quem indicou aparece de
      // relance na lista de contatos (espelha a tag "indicou <vizinho>" do indicador).
      tags: ["new_lead", "referred-customer", `indicado por ${data.referrerName}`.toLowerCase()],
      source: "referral-program",
      fields: {
        "Referral ID": code,
        "Referred By Name": data.referrerName,
        "Referred By Phone": data.referrerPhone,
        "Contact Authorized": data.permission ? "Yes" : "No",
        "Reward 1 Status": "Pending",
        "Reward 2 Status": "Pending",
        "Payment Status": "Not started",
        Services: data.services.join(", "),
      },
    });

    let opportunityId: string | null = null;
    if (referredId) {
      const opp = await ghl<{ opportunity: { id: string } }>(`/opportunities/`, c.apiKey, {
        method: "POST",
        body: JSON.stringify({
          pipelineId: c.pipelineId,
          pipelineStageId: c.stageSubmitted,
          locationId: c.locationId,
          contactId: referredId,
          name: `Referral: ${data.homeownerName} (by ${data.referrerName}) — ${code}`,
          status: "open",
          monetaryValue: 0,
          source: "referral-program",
        }),
      });
      opportunityId = opp?.opportunity?.id || null;
    }

    // ── 2) The referrer: tag if they already exist, otherwise a bare contact ──
    const referredTag = `indicou ${data.homeownerName}`.toLowerCase();
    let referrerId = await findExistingContact(c, data.referrerPhone, data.referrerEmail);
    const referrerAlreadyExisted = Boolean(referrerId);

    if (referrerId) {
      // Existing customer — do NOT rewrite their record, just mark the referral.
      await addTags(c, referrerId, [referredTag]);
    } else {
      // Not in the CRM — create the minimum needed to reach them with rewards.
      const { firstName, lastName } = splitName(data.referrerName);
      const created = await ghl<{ contact: { id: string } }>(`/contacts/`, c.apiKey, {
        method: "POST",
        body: JSON.stringify({
          locationId: c.locationId,
          firstName,
          lastName,
          phone: data.referrerPhone || undefined,
          email: data.referrerEmail || undefined,
          source: "referral-program",
          tags: ["referral-source", referredTag],
        }),
      });
      referrerId = created?.contact?.id || null;
    }

    // ── 3) Link the referrer back onto the neighbor's card ───────────────────
    if (referredId && referrerId && ids["Referrer Contact ID"]) {
      await ghl(`/contacts/${referredId}`, c.apiKey, {
        method: "PUT",
        body: JSON.stringify({
          customFields: [{ id: ids["Referrer Contact ID"], field_value: referrerId }],
        }),
      });
    }

    return {
      ok: true as const,
      code,
      referrerId,
      referrerAlreadyExisted,
      referredId,
      opportunityId,
      welcomePath: `/welcome/${code}`,
    };
  });
