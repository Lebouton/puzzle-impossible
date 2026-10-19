// Chaque puzzle a sa ligne dans la base : ciel = 1, feuilles = 2
const IDS = { sky: 1, leaves: 2 };

export async function onRequestGet({ request, env }) {
  const z = new URL(request.url).searchParams.get('z') || 'sky';
  const id = IDS[z] || 1;
  let r = null;
  try {
    r = await env.DB.prepare('SELECT tries, best, finished FROM stats WHERE id = ?1').bind(id).first();
  } catch (e) {}
  return new Response(JSON.stringify(r || { tries: 0, best: 0, finished: 0 }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=20' }
  });
}
