export async function onRequestGet({ env }) {
  let r = null;
  try {
    r = await env.DB.prepare('SELECT tries, best, finished FROM stats WHERE id = 1').first();
  } catch (e) {}
  return new Response(JSON.stringify(r || { tries: 0, best: 0, finished: 0 }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=20' }
  });
}
