import { rewriteOG, LEAVES } from '../../../_lib/og.js';
export const onRequest = (context) => rewriteOG(context, true, LEAVES);
