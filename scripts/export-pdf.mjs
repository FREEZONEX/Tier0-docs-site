import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join, normalize, extname } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const distDir = resolve(root, process.env.PDF_DIST_DIR || 'dist');
const outputDir = resolve(root, 'dist');
const outputPath = resolve(root, process.env.PDF_OUTPUT_PATH || 'dist/tier0-docs.pdf');
const port = Number(process.env.PDF_PREVIEW_PORT || 4329);
const host = '127.0.0.1';
const url = `http://${host}:${port}/pdf/`;

const PDF_DOC_ROUTES = [
	['get-started/installation', 'doc-1'],
	['get-started/demo-factory', 'doc-2'],
	['get-started/choosing-version', 'doc-3'],
	['using-tier0/uns-concepts', 'doc-4'],
	['using-tier0/connect-data', 'doc-5'],
	['using-tier0/working-with-uns-data', 'doc-6'],
	['using-tier0/build-apps', 'doc-7'],
	['using-tier0/analyze-data', 'doc-8'],
	['using-tier0/agents', 'doc-9'],
	['best-practice/uns-modeling', 'doc-10'],
	['best-practice/protocol-connections', 'doc-11'],
	['best-practice/analytics-apps', 'doc-12'],
	['reference/api-reference', 'doc-13'],
	['reference/tier0-openapi', 'doc-13'],
	['reference/skill-reference', 'doc-14'],
	['reference/tier0-skill', 'doc-14'],
	['reference/high-availability-deployment', 'doc-15'],
	['reference/sla-and-ha-boundaries', 'doc-16'],
	['reference/standard-port-list', 'doc-17'],
	['reference/operations-runbook', 'doc-18'],
];

const MIME_TYPES = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.pdf': 'application/pdf',
};

if (!existsSync(distDir)) {
	console.error('dist/ was not found. Run `npm run build` before exporting the PDF.');
	process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

function resolveDistPath(requestUrl) {
	const urlPath = decodeURIComponent(new URL(requestUrl, `http://${host}:${port}`).pathname);
	let filePath = normalize(join(distDir, urlPath));

	if (!filePath.startsWith(distDir)) return null;
	if (existsSync(filePath) && statSync(filePath).isDirectory()) {
		filePath = join(filePath, 'index.html');
	}
	if (!existsSync(filePath)) {
		filePath = join(distDir, urlPath, 'index.html');
	}
	if (!normalize(filePath).startsWith(distDir) || !existsSync(filePath)) return null;
	return filePath;
}

const server = createServer((request, response) => {
	const filePath = resolveDistPath(request.url || '/');
	if (!filePath) {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Not found');
		return;
	}

	response.writeHead(200, {
		'content-type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
	});
	createReadStream(filePath).pipe(response);
});

function listen() {
	return new Promise((resolveListen, rejectListen) => {
		server.once('error', rejectListen);
		server.listen(port, host, () => resolveListen());
	});
}

function closeServer() {
	return new Promise((resolveClose) => {
		server.close(() => resolveClose());
	});
}

async function launchBrowser() {
	const candidates = [{ channel: 'chrome' }, { channel: 'msedge' }, {}];

	for (const candidate of candidates) {
		try {
			return await chromium.launch({
				...candidate,
				headless: true,
			});
		} catch (error) {
			if (candidate.channel) {
				console.warn(`Could not launch ${candidate.channel}; trying the next browser option.`);
			} else {
				throw error;
			}
		}
	}
}

let browser;
try {
	await listen();
	browser = await launchBrowser();
	const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.evaluate((routes) => {
		const routeToAnchor = new Map(routes);
		const anchorToRoute = new Map(routes.map(([route, anchor]) => [anchor, route]));
		const normalizePath = (path) => path.replace(/^\/+|\/+$/g, '').replace(/\/index$/, '');

		for (const link of document.querySelectorAll('a[href]')) {
			const rawHref = link.getAttribute('href');
			if (!rawHref || rawHref.startsWith('#')) continue;
			if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) continue;

			const sourceArticle = link.closest('article[id]');
			const sourceRoute = sourceArticle ? anchorToRoute.get(sourceArticle.id) : '';
			const baseUrl = sourceRoute
				? new URL(`/${sourceRoute}/`, window.location.origin)
				: new URL(window.location.href);
			const resolved = new URL(rawHref, baseUrl);

			if (resolved.origin !== window.location.origin) continue;

			const targetRoute = normalizePath(resolved.pathname);
			const targetAnchor = routeToAnchor.get(targetRoute);
			if (!targetAnchor) continue;

			if (resolved.hash) {
				const targetId = decodeURIComponent(resolved.hash.slice(1));
				const targetArticle = document.getElementById(targetAnchor);
				const targetElement = targetArticle?.querySelector(`#${CSS.escape(targetId)}`);
				link.setAttribute('href', targetElement ? `#${targetElement.id}` : `#${targetAnchor}`);
			} else {
				link.setAttribute('href', `#${targetAnchor}`);
			}
		}
	}, PDF_DOC_ROUTES);
	await page.emulateMedia({ media: 'print' });
	await page.pdf({
		path: outputPath,
		format: 'A4',
		printBackground: true,
		preferCSSPageSize: true,
		margin: {
			top: '18mm',
			right: '16mm',
			bottom: '20mm',
			left: '16mm',
		},
	});
	console.log(`PDF exported to ${outputPath}`);
} finally {
	if (browser) await browser.close();
	await closeServer();
}
