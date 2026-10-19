// Personnalise l'aperçu du lien (WhatsApp, Messenger, X...) quand l'adresse contient un score.
export const SKY = {
  total: 96, dir: '/s/',
  tailFr: 'C\'est impossible !', tailEn: 'It\'s impossible!',
  descFr: 'Puzzle impossible en ligne : un ciel bleu, 96 pièces. Tu fais mieux ?',
  descEn: 'Impossible puzzle online: one blue sky, 96 pieces. Can you do better?'
};
export const LEAVES = {
  total: 150, dir: '/s/leaves/',
  tailFr: 'Il est costaud !', tailEn: 'Tough one!',
  descFr: 'Puzzle Feuilles d\'automne : 150 pièces à replacer. Tu fais mieux ?',
  descEn: 'Autumn Leaves puzzle: 150 pieces to put back. Can you do better?'
};

export async function rewriteOG(context, frPage, cfg) {
  const res = await context.next();
  const url = new URL(context.request.url);
  const p = parseInt(url.searchParams.get('p'), 10);
  const t = parseInt(url.searchParams.get('t'), 10);
  const type = res.headers.get('content-type') || '';
  if (!type.includes('text/html') || !(p >= 0 && p <= cfg.total) || !(t >= 0)) return res;

  const fr = frPage || url.searchParams.get('l') === 'fr';
  const time = t < 60 ? t + ' s'
    : t < 3600 ? Math.floor(t / 60) + ' min'
    : Math.floor(t / 3600) + ' h ' + String(Math.floor(t / 60) % 60).padStart(2, '0');
  const unit = fr ? (p > 1 ? ' pièces' : ' pièce') : (p === 1 ? ' piece' : ' pieces');
  const title = p === cfg.total
    ? (fr ? 'Terminé en ' + time + ' !' : 'Finished in ' + time + '!')
    : (fr ? p + unit + ' en ' + time + '. ' + cfg.tailFr : p + unit + ' in ' + time + '. ' + cfg.tailEn);
  const desc = fr ? cfg.descFr : cfg.descEn;
  const img = 'https://nopepuzzle.com' + cfg.dir + p + '.png';
  const set = (v) => ({ element(e) { e.setAttribute('content', v); } });

  return new HTMLRewriter()
    .on('meta[property="og:title"]', set(title))
    .on('meta[property="og:description"]', set(desc))
    .on('meta[property="og:image"]', set(img))
    .on('meta[name="description"]', set(desc))
    .transform(res);
}
