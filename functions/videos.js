export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  /* ===== GET VIDEO ===== */
  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await env.VIDEOS.get(id, { type: 'json' });
    if (!data) {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /* ===== SAVE VIDEO ===== */
  if (request.method === 'POST') {
    const body = await request.json();
    const id = Object.keys(body)[0];
    const data = body[id];

    if (!id || !data) {
      return new Response(
        JSON.stringify({ error: 'Invalid body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.VIDEOS.put(id, JSON.stringify(data));

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /* ===== DELETE VIDEO ===== */
  if (request.method === 'DELETE') {
    const { id } = await request.json();
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.VIDEOS.delete(id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Method Not Allowed', { status: 405 });
}
