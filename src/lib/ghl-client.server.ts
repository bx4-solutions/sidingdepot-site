// Server-only module — never import from client-facing code.
// Reusable, env-driven GoHighLevel REST API client. Every credential comes
// from env vars (GHL_API_KEY / GHL_LOCATION_ID / GHL_PIPELINE_ID /
// GHL_PIPELINE_STAGE_ID) so this same code works unmodified against any GHL
// sub-account — swap the env vars to point at a different clone/company.
import { ATTRIBUTION_FIELD_DEFS, type AttributionFieldKey } from "./ghl-attribution-fields";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

function getGhlConfig() {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return null;
  return {
    apiKey,
    locationId,
    pipelineId: process.env.GHL_PIPELINE_ID || null,
    pipelineStageId: process.env.GHL_PIPELINE_STAGE_ID || null,
  };
}

async function ghlFetch<T = any>(
  path: string,
  apiKey: string,
  init: RequestInit = {},
): Promise<T | null> {
  try {
    const res = await fetch(`${GHL_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[GHL] ${init.method || "GET"} ${path} -> ${res.status}: ${body}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[GHL] ${init.method || "GET"} ${path} threw:`, err);
    return null;
  }
}

// In-memory cache of fieldKey -> fieldId, populated by ensureCustomFields().
// Lives for the lifetime of the serverless function instance — cheap re-check
// on cold start, zero extra calls on warm invocations.
let _fieldCache: Record<string, string> | null = null;

/**
 * Idempotent: fetches existing "contact" custom fields for the location and
 * creates any from ATTRIBUTION_FIELD_DEFS that don't exist yet. Never
 * modifies or deletes an existing field. Safe to call on every request —
 * results are cached in-process after the first successful run.
 */
export async function ensureCustomFields(): Promise<Record<AttributionFieldKey, string> | null> {
  const config = getGhlConfig();
  if (!config) return null;
  if (_fieldCache) return _fieldCache as Record<AttributionFieldKey, string>;

  const existing = await ghlFetch<{ customFields: Array<{ id: string; name: string }> }>(
    `/locations/${config.locationId}/customFields?model=contact`,
    config.apiKey,
  );
  if (!existing) return null;

  // Match by name, not by re-deriving a slug from fieldKey — GHL doesn't
  // guarantee the fieldKey slug matches our short `key` (e.g. "Google Click
  // ID (GCLID)" becomes fieldKey "google_click_id_gclid", not "gclid").
  const byName = new Map(existing.customFields.map((f) => [f.name, f.id]));

  const byKey: Record<string, string> = {};
  for (const def of ATTRIBUTION_FIELD_DEFS) {
    const existingId = byName.get(def.name);
    if (existingId) {
      byKey[def.key] = existingId;
      continue;
    }
    const created = await ghlFetch<{ customField: { id: string } }>(
      `/locations/${config.locationId}/customFields`,
      config.apiKey,
      {
        method: "POST",
        body: JSON.stringify({ name: def.name, dataType: "TEXT", model: "contact" }),
      },
    );
    if (created?.customField?.id) {
      byKey[def.key] = created.customField.id;
    }
  }

  _fieldCache = byKey;
  return byKey as Record<AttributionFieldKey, string>;
}

export type UpsertContactInput = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  city?: string;
  tags?: string[];
  source?: string;
  customFieldValues?: Partial<Record<AttributionFieldKey, string | undefined>>;
};

export type GhlContactResult = { id: string; new: boolean } | null;

/** Creates or updates (by phone/email) a contact with full attribution as custom fields. */
export async function upsertContact(input: UpsertContactInput): Promise<GhlContactResult> {
  const config = getGhlConfig();
  if (!config) return null;

  const fieldIds = await ensureCustomFields();

  const customFields: Array<{ id: string; field_value: string }> = [];
  if (fieldIds && input.customFieldValues) {
    for (const [key, value] of Object.entries(input.customFieldValues)) {
      if (!value) continue;
      const id = fieldIds[key as AttributionFieldKey];
      if (id) customFields.push({ id, field_value: String(value) });
    }
  }

  const result = await ghlFetch<{ contact: { id: string }; new: boolean }>(
    `/contacts/upsert`,
    config.apiKey,
    {
      method: "POST",
      body: JSON.stringify({
        locationId: config.locationId,
        firstName: input.firstName,
        lastName: input.lastName || "",
        email: input.email || undefined,
        phone: input.phone,
        city: input.city || undefined,
        tags: input.tags,
        source: input.source || "website",
        customFields,
      }),
    },
  );

  if (!result?.contact?.id) return null;
  return { id: result.contact.id, new: Boolean(result.new) };
}

export type CreateOpportunityInput = {
  contactId: string;
  name: string;
  monetaryValue?: number;
  source?: string;
};

/** Creates a new opportunity in the configured pipeline. No-op if GHL_PIPELINE_ID isn't set. */
export async function createOpportunity(
  input: CreateOpportunityInput,
): Promise<{ id: string } | null> {
  const config = getGhlConfig();
  if (!config || !config.pipelineId || !config.pipelineStageId) return null;

  const result = await ghlFetch<{ opportunity: { id: string } }>(`/opportunities/`, config.apiKey, {
    method: "POST",
    body: JSON.stringify({
      pipelineId: config.pipelineId,
      pipelineStageId: config.pipelineStageId,
      locationId: config.locationId,
      contactId: input.contactId,
      name: input.name,
      status: "open",
      monetaryValue: input.monetaryValue,
      source: input.source || "website",
    }),
  });

  return result?.opportunity?.id ? { id: result.opportunity.id } : null;
}

export type GhlConversationResult = { id: string; messageId: string } | null;

/**
 * Logs the website form as an inbound CRM conversation. This creates a visible
 * conversation for the sales team without sending an SMS or email to the lead.
 */
export async function createWebsiteLeadConversation(
  contactId: string,
  message: string,
): Promise<GhlConversationResult> {
  const config = getGhlConfig();
  if (!config || !message.trim()) return null;

  const result = await ghlFetch<{ conversationId?: string; messageId?: string }>(
    "/conversations/messages/inbound",
    config.apiKey,
    {
      method: "POST",
      body: JSON.stringify({
        type: "SMS",
        contactId,
        message,
        providerMessageId: `website-form-${crypto.randomUUID()}`,
      }),
    },
  );

  if (!result?.conversationId || !result.messageId) return null;
  return { id: result.conversationId, messageId: result.messageId };
}

// In-memory cache of pipelineStageId -> human-readable stage name.
let _stageNameCache: Record<string, string> | null = null;

/** Resolves a pipeline stage ID to its human-readable name (cached per instance). */
export async function getPipelineStageName(stageId: string): Promise<string | null> {
  const config = getGhlConfig();
  if (!config) return null;

  if (!_stageNameCache) {
    const result = await ghlFetch<{
      pipelines: Array<{ stages: Array<{ id: string; name: string }> }>;
    }>(`/opportunities/pipelines?locationId=${config.locationId}`, config.apiKey);
    if (!result) return null;
    const map: Record<string, string> = {};
    for (const pipeline of result.pipelines) {
      for (const stage of pipeline.stages) {
        map[stage.id] = stage.name;
      }
    }
    _stageNameCache = map;
  }

  return _stageNameCache[stageId] ?? null;
}

export type GhlOpportunitySnapshot = {
  status: string;
  pipelineStageId: string;
  monetaryValue: number | null;
};

/** Reads current status/stage/value for a single opportunity — used by the status sync-back job. */
export async function getOpportunity(
  opportunityId: string,
): Promise<GhlOpportunitySnapshot | null> {
  const config = getGhlConfig();
  if (!config) return null;

  const result = await ghlFetch<{
    opportunity: { status: string; pipelineStageId: string; monetaryValue: number | null };
  }>(`/opportunities/${opportunityId}`, config.apiKey);

  if (!result?.opportunity) return null;
  return {
    status: result.opportunity.status,
    pipelineStageId: result.opportunity.pipelineStageId,
    monetaryValue: result.opportunity.monetaryValue,
  };
}

/** Attaches a free-text note to a contact (e.g. an AI-generated journey summary). */
export async function addContactNote(contactId: string, body: string): Promise<boolean> {
  const config = getGhlConfig();
  if (!config) return false;
  const result = await ghlFetch(`/contacts/${contactId}/notes`, config.apiKey, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  return result !== null;
}

export function isGhlConfigured(): boolean {
  return getGhlConfig() !== null;
}
