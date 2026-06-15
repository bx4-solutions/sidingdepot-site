import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãä]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/ç/g, "c")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchPexelsImage(query: string, pexelsKey: string): Promise<string> {
  if (!pexelsKey) return "";
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      { headers: { Authorization: pexelsKey } },
    );
    const json = await res.json();
    const photos = json.photos ?? [];
    if (!photos.length) return "";
    const pick = photos[Math.floor(Math.random() * photos.length)];
    return pick.src?.large2x || pick.src?.large || "";
  } catch {
    return "";
  }
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error ${res.status}`);
  const json = await res.json();
  return json.content?.[0]?.text ?? "";
}

function extractJson(raw: string): Record<string, unknown> {
  const match = raw.match(/```json\s*([\s\S]*?)```/) ||
    raw.match(/```\s*([\s\S]*?)```/) || [null, raw];
  try {
    return JSON.parse(match[1]?.trim() ?? raw.trim());
  } catch {
    return {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      title,
      keywords = "",
      tone = "professional",
      targetAudience = "homeowners",
      wordCount = 1200,
      city = "Marietta, GA",
      callToAction = "Get a Free Quote",
      provider = "gemini",
      apiKey = "",
      pexelsKey = "",
    } = await req.json();

    if (!title) throw new Error("title is required");
    if (!apiKey)
      throw new Error(
        `API key for ${provider} is not configured. Go to Dashboard → Settings and add your ${provider} API key.`,
      );

    const prompt = `You are an expert SEO content writer for Siding Depot LLC, a James Hardie Elite Preferred contractor in ${city} specializing in siding, windows, painting, decks, gutters, and roofing.

Write a complete SEO-optimized blog article. Return ONLY a valid JSON object (no markdown fences).

Input:
- Title topic: "${title}"
- Keywords: ${keywords || "siding, James Hardie, exterior contractor, Georgia"}
- Tone: ${tone}
- Target audience: ${targetAudience}
- Target word count: ${wordCount} words
- City: ${city}
- CTA: "${callToAction}"

Return exactly this JSON:
{
  "title": "SEO H1 title (max 60 chars)",
  "slug": "url-slug",
  "excerpt": "155-char compelling excerpt",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 155 chars)",
  "readTime": 6,
  "wordCount": 1200,
  "schemaJson": "{escaped Article schema JSON string}",
  "content": "<full HTML article: h2, h3, p, ul, strong. After first h2 insert <img src='SECTION1_IMAGE' alt='...' class='w-full rounded-lg my-6' />. After second h2 insert <img src='SECTION2_IMAGE' alt='...' class='w-full rounded-lg my-6' />. Near end insert <img src='SECTION3_IMAGE' alt='...' class='w-full rounded-lg my-6' />. End with a CTA paragraph mentioning '${callToAction}'.>"
}

Requirements:
- 4-6 H2 sections with H3 subsections
- Reference ${city}, Georgia, and nearby cities naturally
- Mention James Hardie Elite Preferred status
- ${wordCount}+ words of genuinely useful homeowner advice
- Keywords: ${keywords || "siding, contractor, exterior"}`;

    let rawResponse = "";
    if (provider === "gemini") rawResponse = await callGemini(prompt, apiKey);
    else if (provider === "openai") rawResponse = await callOpenAI(prompt, apiKey);
    else if (provider === "anthropic") rawResponse = await callAnthropic(prompt, apiKey);
    else throw new Error(`Unknown provider: ${provider}`);

    const parsed = extractJson(rawResponse);

    const imageQuery = `${title} home exterior siding contractor`;
    const [img1, img2, img3, coverImg] = await Promise.all([
      fetchPexelsImage(`${keywords || "siding"} house exterior`, pexelsKey),
      fetchPexelsImage("home renovation contractor work", pexelsKey),
      fetchPexelsImage("james hardie siding installation", pexelsKey),
      fetchPexelsImage(imageQuery, pexelsKey),
    ]);

    let content = (parsed.content as string) || "";
    if (img1) content = content.replace("SECTION1_IMAGE", img1);
    if (img2) content = content.replace("SECTION2_IMAGE", img2);
    if (img3) content = content.replace("SECTION3_IMAGE", img3);

    const finalSlug = (parsed.slug as string) || toSlug((parsed.title as string) || title);

    return new Response(
      JSON.stringify({
        title: parsed.title || title,
        slug: finalSlug,
        excerpt: parsed.excerpt || "",
        metaTitle: parsed.metaTitle || parsed.title || title,
        metaDescription: parsed.metaDescription || parsed.excerpt || "",
        content,
        readTime: parsed.readTime || 6,
        wordCount: parsed.wordCount || wordCount,
        coverImage: coverImg,
        schemaJson: parsed.schemaJson || "",
        images: { section1: img1, section2: img2, section3: img3 },
        provider,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("generate-blog-article error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
