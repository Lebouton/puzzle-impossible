import { rewriteOG, SKY } from '../_lib/og.js';
export const onRequest = (context) => rewriteOG(context, true, SKY);
