import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/908953/9d77e492-491c-43f9-ba28-768f56f48335";

export const ghlSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  source: z.string().default("website"),
  message: z.string().optional(),
  location: z.string().optional(),
  service_requested: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  drop_date: z.string().optional(),
  early_pickup: z.string().optional(),
  placement_instructions: z.string().optional(),
  payment_method: z.string().optional(),
  tag: z.string().optional(),
});

export const submitToGHL = createServerFn({ method: "POST" })
  .inputValidator((data) => ghlSchema.parse(data))
  .handler(async ({ data }) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    console.info(`[GHL-TELEMETRY] ${new Date().toISOString()} | REQUEST | id: ${requestId} | source: ${data.source}`);

    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
          requestId,
        }),
      });

      const duration = Date.now() - startTime;
      const status = response.status;

      if (!response.ok) {
        console.error(`[GHL-TELEMETRY] ${new Date().toISOString()} | ERROR | id: ${requestId} | status: ${status} | duration: ${duration}ms`);
        throw new Error(`GHL Webhook failed with status ${status}`);
      }

      console.info(`[GHL-TELEMETRY] ${new Date().toISOString()} | SUCCESS | id: ${requestId} | status: ${status} | duration: ${duration}ms`);
      
      return { success: true };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[GHL-TELEMETRY] ${new Date().toISOString()} | EXCEPTION | id: ${requestId} | error: ${error instanceof Error ? error.message : String(error)} | duration: ${duration}ms`);
      throw error;
    }
  });
