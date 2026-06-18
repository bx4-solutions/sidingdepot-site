import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabaseUrl or supabaseKey", { supabaseUrl, supabaseKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  
  // Try querying google_place_stats
  const { data: stats, error: statsError } = await supabase
    .from('google_place_stats')
    .select('*');
  
  if (statsError) {
    console.error("Error querying google_place_stats:", statsError);
  } else {
    console.log("google_place_stats:", stats);
  }

  // Try querying google_reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('google_reviews')
    .select('*')
    .limit(5);

  if (reviewsError) {
    console.error("Error querying google_reviews:", reviewsError);
  } else {
    console.log("google_reviews count:", reviews ? reviews.length : 0);
    console.log("google_reviews sample:", reviews);
  }
}

test();
