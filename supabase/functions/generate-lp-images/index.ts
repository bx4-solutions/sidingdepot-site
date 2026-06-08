import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Image prompts for each LP section
const LP_IMAGE_PROMPTS: Record<string, { prompt: string; filename: string }> = {
  hero: {
    prompt: "Professional business owner in a modern office setting, looking at smartphone with concerned expression seeing multiple missed call notifications on screen. Warm natural lighting, cinematic quality, realistic photo style. The person is a middle-aged professional wearing business casual attire. Ultra high resolution, 16:9 aspect ratio hero image.",
    filename: "lp-hero.png"
  },
  hook: {
    prompt: "Close-up view of a smartphone screen showing multiple red missed call notification badges and unread message alerts. The phone is held by a hand of a busy professional. Dramatic lighting with focus on the notifications. Business context, urgent feeling. Ultra high resolution.",
    filename: "lp-hook-phone.png"
  },
  dailyLife: {
    prompt: "Service professional (plumber or HVAC technician) in work uniform standing next to a branded white work van in early morning light. The worker is checking their phone while loading equipment. Realistic, warm lighting, professional appearance. The van has a ladder on top. Ultra high resolution.",
    filename: "lp-daily-worker.png"
  },
  problem: {
    prompt: "Clean infographic-style visualization showing money (dollar bills and coins) metaphorically flying away from a ringing phone icon. Modern design with purple and red color accents on white background. Business loss concept. Minimalist and professional graphic style. Ultra high resolution.",
    filename: "lp-problem-stats.png"
  },
  whyHappens: {
    prompt: "Overwhelmed small business owner at a cluttered desk with phone ringing, multiple papers and notes scattered around. Expression of stress and time pressure. The person is trying to work on a laptop while the phone demands attention. Relatable and emotional scene. Ultra high resolution.",
    filename: "lp-why-overwhelmed.png"
  },
  solution: {
    prompt: "A beautiful female AI virtual receptionist named Bia working in a modern phone control room. She is clearly an artificial intelligence - a sophisticated android with smooth synthetic skin with subtle purple LED accents on temples and neck, elegant metallic silver highlights on cheekbones and jawline, warm friendly expression with luminous eyes that show intelligence, wearing a professional white blouse. Not too futuristic or scary - beautiful, elegant and approachable. She sits at a curved control station with multiple holographic screens showing incoming calls and messages, calendar integration display with appointments, chat message bubbles floating around, purple ambient lighting matching brand color. The room has a modern call center aesthetic with subtle tech elements. Clean background without any logos or text overlays. Photorealistic quality with soft lighting. Ultra high resolution. 16:9 aspect ratio.",
    filename: "lp-solution-ai.png"
  },
  howItWorks: {
    prompt: "Split screen composition showing on one side a customer making a phone call on their smartphone, and on the other side a friendly AI chat interface responding. Clean modern design with purple accent colors. The flow shows the connection between customer and AI. Ultra high resolution.",
    filename: "lp-how-works.png"
  },
  success: {
    prompt: "Happy and relaxed business owner in a comfortable office setting, smiling confidently while looking at positive business metrics on a tablet. In the background, subtle visual indication of AI handling calls. Warm lighting, success and relief feeling. Professional photography style. Ultra high resolution.",
    filename: "lp-success.png"
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { section, customPrompt } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Get prompt for the section
    const sectionConfig = LP_IMAGE_PROMPTS[section];
    if (!sectionConfig && !customPrompt) {
      throw new Error(`Invalid section: ${section}. Valid sections: ${Object.keys(LP_IMAGE_PROMPTS).join(", ")}`);
    }

    const prompt = customPrompt || sectionConfig.prompt;
    const filename = sectionConfig?.filename || `lp-custom-${section}.png`;

    console.log(`Generating image for section: ${section}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);

    // Call Lovable AI to generate image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Extract base64 image from response
    const imageData = aiResponse.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.error("No image in response:", JSON.stringify(aiResponse).substring(0, 500));
      throw new Error("No image generated in AI response");
    }

    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lp-images")
      .upload(filename, imageBuffer, {
        contentType: "image/png",
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("lp-images")
      .getPublicUrl(filename);

    const publicUrl = urlData?.publicUrl;

    console.log(`Image uploaded successfully: ${publicUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        section,
        filename,
        url: publicUrl,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating LP image:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
