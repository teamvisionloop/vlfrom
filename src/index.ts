export default {
  async fetch(request, env) {
    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      try {
        const { name, email, phone, subject, message } = await request.json();

        // Insert into D1
        await env.DB.prepare(`
          INSERT INTO contacts (name, email, phone, subject, message)
          VALUES (?, ?, ?, ?, ?)
        `).bind(name, email, phone, subject, message).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // this fixes browser network errors
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" 
          },
        });
      }
    }

    return new Response("Send a POST request", {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
};
