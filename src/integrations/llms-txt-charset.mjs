// @ts-check
/**
 * Best-effort helper that asks the dev / preview / static-host response to
 * include `Content-Type: text/plain; charset=utf-8` for the AI-friendly
 * `/llms*.txt` outputs.
 *
 * Why: AI crawlers that decode the response without honoring the declared
 * charset fall back to a system-default code page (e.g. GBK on Chinese
 * Windows) and mangle punctuation like `—`, `'`, `"` into the classic
 * `â€"` / `鈥漖` mojibake. The source files themselves are clean UTF-8,
 * so the only thing missing is an authoritative Content-Type.
 *
 * What is and isn't covered:
 *  - `astro:server:setup` fires for `astro dev` AND when Astro runs in
 *    `output: 'server'` mode. The Astro integration below covers that.
 *  - `astro preview` of a static build uses Vite's preview server, not
 *    Astro's. The matching Vite plugin below hooks `configurePreviewServer`
 *    for that path.
 *  - In production, the static host (Netlify / Cloudflare Pages / Vercel /
 *    nginx …) decides the Content-Type. Most of them default to
 *    `text/plain; charset=utf-8` for `.txt`; if your host doesn't, configure
 *    the equivalent of a `Content-Type: text/plain; charset=utf-8` rule
 *    for `/llms*.txt`.
 *
 * The middleware is registered BEFORE Vite's own static handler in both
 * paths, so it runs before any per-file setHeader call downstream and the
 * charset survives.
 */

const TXT_PATHS = new Set(['/llms.txt', '/llms-full.txt', '/llms-small.txt']);

/** @type {import('astro').AstroIntegration} */
export const llmsTxtCharsetIntegration = {
	name: 'tier0-llms-txt-charset',
	hooks: {
		'astro:server:setup': ({ server }) => {
			server.middlewares.use(function tier0LlmsTxtCharset(req, res, next) {
				const rawUrl = req.url ? req.url.split('?')[0] : '';
				if (rawUrl && TXT_PATHS.has(rawUrl)) {
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
				}
				next();
			});
		},
	},
};

/** Vite plugin that handles `astro preview` of a static build. */
export function llmsTxtCharsetVitePlugin() {
	return {
		name: 'tier0-llms-txt-charset',
		apply: 'serve',
		configurePreviewServer(server) {
			server.middlewares.use(function tier0LlmsTxtCharsetPreview(req, res, next) {
				const rawUrl = req.url ? req.url.split('?')[0] : '';
				if (rawUrl && TXT_PATHS.has(rawUrl)) {
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
				}
				next();
			});
		},
	};
}
