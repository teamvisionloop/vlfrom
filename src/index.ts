export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Send a POST request");
    }

    const { name, email, phone, subject, message } = await request.json();

    await env.DB.prepare(`
      INSERT INTO contacts (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(name, email, phone, subject, message).run();

    return new Response("Form submitted successfully");
  }
};
