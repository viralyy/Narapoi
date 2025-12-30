export async function onRequest({ request, env }) {
  const KEY = 'videos';

  // ===== PASTIKAN KV ADA =====
  if (!env.VIDEOS) {
    return new Response(
      JSON.stringify({ error: 'KV VIDEOS not bound' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ===== LOAD DATA =====
  let data = {};
  const raw = await env.VIDEOS.get(KEY);
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = {};
    }
  }

  // ===== POST (TAMBAH / UPDATE VIDEO) =====
  if (request.method === 'POST') {
    const body = await request.json();

    data = {
      ...data,
      ...body
    };

    await env.VIDEOS.put(KEY, JSON.stringify(data));
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ===== DELETE (HAPUS VIDEO) =====
  if (request.method === 'DELETE') {
    const { id } = await request.json();
    if (id && data[id]) {
      delete data[id];
      await env.VIDEOS.put(KEY, JSON.stringify(data));
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ===== GET (UNTUK INDEX / PLAYER) =====
  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
