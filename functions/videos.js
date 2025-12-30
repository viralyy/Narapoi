export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  /* ===== GET ===== */
  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }

    const data = await env.VIDEOS.get(id, { type: 'json' });
    if (!data) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json(data);
  }

  /* ===== POST ===== */
  if (request.method === 'POST') {
    const body = await request.json();
    const id = Object.keys(body)[0];
    const data = body[id];

    if (!id || !data) {
      return Response.json({ error: 'Invalid body' }, { status: 400 });
    }

    await env.VIDEOS.put(id, JSON.stringify(data));
    return Response.json({ success: true });
  }

  /* ===== DELETE ===== */
  if (request.method === 'DELETE') {
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }

    await env.VIDEOS.delete(id);
    return Response.json({ success: true });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
