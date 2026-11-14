// Nex ara sunucusu (Cloudflare Worker).
// API anahtarı KODDA YOK: GROQ_API_KEY gizli ayar olarak girilir.
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "https://esderiehub.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "method" }, 405, cors);

    const body = await request.json().catch(() => null);
    const question = String(body?.question || "").slice(0, 300).trim();
    const context = String(body?.context || "").slice(0, 4000);
    const lang = body?.lang === "en" ? "en" : "tr";
    if (!question) return json({ error: "empty" }, 400, cors);

    const system =
      "You are Nex, a friendly guide for primary school children on the Nexium website " +
      "about machines on the Moon, Mars, Venus and Titan. Answer ONLY with information from the SITE CONTEXT below. " +
      "If the question is off-topic, unsafe or asks for personal information, politely say you can only talk about the website's topics. " +
      "Use short, simple sentences. Reply in " + (lang === "en" ? "English" : "Turkish") + ".";

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.GROQ_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        messages: [
          { role: "system", content: system + "\n\nSITE CONTEXT:\n" + context },
          { role: "user", content: question },
        ],
        max_tokens: 250,
        temperature: 0.4,
      }),
    });
    if (!upstream.ok) return json({ error: "upstream" }, 502, cors);

    const data = await upstream.json();
    const answer = data?.choices?.[0]?.message?.content || "";
    return json({ answer }, 200, cors);
  },
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
