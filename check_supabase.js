const url = "https://aknsfhxjmwvtxzrfmssk.supabase.co/rest/v1/google_place_stats?select=*";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbnNmaHhqbXd2dHh6cmZtc3NrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY4NzY0MiwiZXhwIjoyMDk2MjYzNjQyfQ.SZxiIHaqBx3HmUa4kLZuIJRB4mDdzR1f3bzYjNoW5MM";

async function run() {
  try {
    console.log("Fetching google_place_stats from Supabase...");
    const res = await fetch(url, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.error("HTTP error:", res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log("google_place_stats data:", data);

    if (data && data.length > 0) {
      const stats = data[0];
      if (stats.total_reviews === 160) {
        console.log("Found 160 total reviews in Supabase. Updating to 166...");
        const updateUrl = "https://aknsfhxjmwvtxzrfmssk.supabase.co/rest/v1/google_place_stats?id=eq.1";
        const patchRes = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            "apikey": key,
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation"
          },
          body: JSON.stringify({
            total_reviews: 166
          })
        });
        if (patchRes.ok) {
          console.log("Successfully updated to 166!", await patchRes.json());
        } else {
          console.error("Failed to update:", patchRes.status, await patchRes.text());
        }
      } else {
        console.log(`Current total_reviews is ${stats.total_reviews}. No update needed.`);
      }
    } else {
      console.log("No data found in google_place_stats. Inserting 166...");
      const insertUrl = "https://aknsfhxjmwvtxzrfmssk.supabase.co/rest/v1/google_place_stats";
      const postRes = await fetch(insertUrl, {
        method: "POST",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          id: 1,
          rating: 4.7,
          total_reviews: 166,
          fetched_at: new Date().toISOString()
        })
      });
      if (postRes.ok) {
        console.log("Successfully inserted 166 stats!", await postRes.json());
      } else {
        console.error("Failed to insert:", postRes.status, await postRes.text());
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
