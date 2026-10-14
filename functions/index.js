// Personnalise l'aperçu du lien (WhatsApp, Messenger, X...) quand l'adresse contient un score.
export async function onRequest(context) {
  const res = await context.next();
  const url = new URL(context.request.url);
  const p = parseInt(url.searchParams.get('p'), 10);
  const t = parseInt(url.searchParams.get('t'), 10);
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html') || !(p >= 0 && p <= 96) || !(t >= 0)) return res;

  const fr = url.searchParams.get('l') === 'fr';
  const time = t < 60 ? t + ' s'
    : t < 3600 ? Math.floor(t / 60) + ' min'
    : Math.floor(t / 3600) + ' h ' + String(Math.floor(t / 60) % 60).padStart(2, '0');
  const unit = fr ? (p > 1 ? ' pièces' : ' pièce') : (p === 1 ? ' piece' : ' pieces');
  const title = p === 96
    ? (fr ? 'Terminé en ' + time + ' !' : 'Finished in ' + time + '!')
    : (fr ? p + unit + ' en ' + time + '. C\'est impossible !' : p + unit + ' in ' + time + '. It\'s impossible!');
  const desc = fr
    ? 'Le puzzle de l\'impossible : un ciel bleu, 96 pièces. Tu fais mieux ?'
    : 'The Impossible Puzzle: one blue sky, 96 pieces. Can you do better?';
  const img = 'https://nopepuzzle.com/s/' + p + '.png';
  const set = (v) => ({ element(e) { e.setAttribute('content', v); } });

  return new HTMLRewriter()
    .on('meta[property="og:title"]', set(title))
    .on('meta[property="og:description"]', set(desc))
    .on('meta[property="og:image"]', set(img))
    .on('meta[name="description"]', set(desc))
    .transform(res);
}
