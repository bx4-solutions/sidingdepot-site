import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { title, prompt, type } = await req.json();

    if (!title && !prompt) {
      throw new Error("Title or prompt is required");
    }

    console.log("Generating image for:", { title, prompt, type });

    // Build the image generation prompt
    const imagePrompt =
      prompt ||
      `Create a professional, modern blog cover image for an article titled: "${title}". 
Style: Clean, minimalist, business-oriented with subtle gradients. 
Colors: Blue and purple tones with white accents.
Include subtle tech/AI elements like abstract circuits or data visualization.
No text in the image. Ultra high resolution.
16:9 aspect ratio for a hero image.`;

    // Call Lovable AI for image generation
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: imagePrompt,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        throw new Error("Rate limits exceeded. Please try again later.");
      }
      if (response.status === 402) {
        throw new Error("Payment required. Please add credits to your workspace.");
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract base64 image from response
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageData) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    // Extract base64 content
    const base64Content = imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Content), (c) =>
      c.charCodeAt(0)
    );

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });

    // Generate unique filename
    const timestamp = Date.now();
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .substring(0, 30)
      : "generated";
    const filename = `${type || "image"}-${slug}-${timestamp}.png`;

    console.log("Uploading to storage:", filename);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filename, imageBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filename);

    console.log("Image uploaded successfully:", urlData.publicUrl);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: urlData.publicUrl,
        filename,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-blog-image:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
