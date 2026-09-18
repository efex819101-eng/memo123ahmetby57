const API_URL = process.env.SMM_API_URL || "https://smm.org.tr/api/v2";

exports.handler = async (event) => {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "POST gerekli." }) };
  }
  if (!process.env.SMM_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Netlify SMM_API_KEY değişkeni ayarlanmamış." }) };
  }

  let input;
  try { input = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Geçersiz JSON." }) }; }

  const action = String(input.action || "");
  const allowed = new Set(["services", "balance", "add", "status", "orders", "refill", "cancel"]);
  if (!allowed.has(action)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Geçersiz API işlemi." }) };
  }

  const params = new URLSearchParams();
  params.set("key", process.env.SMM_API_KEY);
  params.set("action", action);

  for (const key of ["service", "link", "quantity", "order", "orders"]) {
    if (input[key] !== undefined && input[key] !== null) params.set(key, String(input[key]));
  }

  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: "API geçersiz yanıt döndürdü.", raw: text.slice(0, 500) }; }
    return { statusCode: r.status, headers, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "SMM API bağlantısı kurulamadı." }) };
  }
};
