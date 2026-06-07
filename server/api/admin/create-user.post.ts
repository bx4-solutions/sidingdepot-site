import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password } = body || {};

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: "name, email and password are required" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, message: "SUPABASE_SERVICE_ROLE_KEY not configured on server" });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name: name },
    email_confirm: true,
  });

  if (error) {
    throw createError({ statusCode: 400, message: error.message });
  }

  return { success: true, user: { id: data.user.id, email: data.user.email } };
});
