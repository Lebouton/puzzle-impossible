// Chaque puzzle a sa ligne dans la base : ciel = 1, feuilles = 2
const PUZZLES = { sky: { id: 1, total: 96 }, leaves: { id: 2, total: 150 } };

export async function onRequestPost({ request, env }) {
  let b = {};
  try { b = await request.json(); } catch (e) {}
  const z = PUZZLES[b.z] || PUZZLES.sky;
  try {
    if (b.a === 'start') {
      await env.DB.prepare('UPDATE stats SET tries = tries + 1 WHERE id = ?1').bind(z.id).run();
    } else if (b.a === 'end') {
      const p = Number.isInteger(b.p) ? b.p : -1;
      const t = Number.isInteger(b.t) ? b.t : -1;
      // garde-fou simple : au moins 3 secondes par pièce
      if (p >= 0 && p <= z.total && t >= p * 3) {
        await env.DB.prepare('UPDATE stats SET best = MAX(best, ?1), finished = finished + ?2 WHERE id = ?3')
          .bind(p, p === z.total ? 1 : 0, z.id).run();
      }
    }
  } catch (e) {}
  let r = null;
  try {
    r = await env.DB.prepare('SELECT tries, best, finished FROM stats WHERE id = ?1').bind(z.id).first();
  } catch (e) {}
  return new Response(JSON.stringify(r || { tries: 0, best: 0, finished: 0 }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
