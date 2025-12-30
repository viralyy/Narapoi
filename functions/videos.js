export async function onRequest({ request, env }) {
  const KEY = "videos";
  let data = {};

  const raw = await env.VIDEOS.get(KEY);
  if (raw) data = JSON.parse(raw);

  // ===== TAMBAH / UPDATE =====
  if (request.method === "POST") {
    const body = await request.json();
    data = { ...data, ...body };

    await env.VIDEOS.put(KEY, JSON.stringify(data, null, 2));
    return Response.json({ success: true });
  }

  // ===== HAPUS =====
  if (request.method === "DELETE") {
    const { id } = await request.json();
    delete data[id];

    await env.VIDEOS.put(KEY, JSON.stringify(data, null, 2));
    return Response.json({ success: true });
  }

  // ===== GET (seperti videos.json) =====
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
