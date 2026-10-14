const TOTAL = 96;

export async function onRequestPost({ request, env }) {
  let b = {};
  try { b = await request.json(); } catch (e) {}
  try {
    if (b.a === 'start') {
      await env.DB.prepare('UPDATE stats SET tries = tries + 1 WHERE id = 1').run();
    } else if (b.a === 'end') {
      const p = Number.isInteger(b.p) ? b.p : -1;
      const t = Number.isInteger(b.t) ? b.t : -1;
      // garde-fou simple : au moins 3 secondes par pièce
      if (p >= 0 && p <= TOTAL && t >= p * 3) {
        await env.DB.prepare('UPDATE stats SET best = MAX(best, ?1), finished = finished + ?2 WHERE id = 1')
          .bind(p, p === TOTAL ? 1 : 0).run();
      }
    }
  } catch (e) {}
  let r = null;
  try {
    r = await env.DB.prepare('SELECT tries, best, finished FROM stats WHERE id = 1').first();
  } catch (e) {}
  return new Response(JSON.stringify(r || { tries: 0, best: 0, finished: 0 }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
