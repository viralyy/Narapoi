export async function onRequest({ request, env }) {
  const KEY = 'videos';
  let data = {};

  const raw = await env.VIDEOS.get(KEY);
  if (raw) data = JSON.parse(raw);

  // GET
  if (request.method === 'GET') {
    return new Response(JSON.stringify(data, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST (tambah / update)
  if (request.method === 'POST') {
    const body = await request.json();
    data = { ...data, ...body };
    await env.VIDEOS.put(KEY, JSON.stringify(data));
    return Response.json({ success: true });
  }

  // DELETE
  if (request.method === 'DELETE') {
    const { id } = await request.json();
    delete data[id];
    await env.VIDEOS.put(KEY, JSON.stringify(data));
    return Response.json({ success: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
