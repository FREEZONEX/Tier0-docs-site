import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, join, normalize, extname } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument, rgb } from 'pdf-lib';
import { updateManualTitle, rasterizeManualTitle } from '../src/lib/manual-pdf.js';
import { MANUAL_LOCALES, manualText } from '../src/lib/manual-locales.js';

const root = process.cwd();
const distDir = resolve(root, process.env.PDF_DIST_DIR || 'dist');
const outputDir = resolve(root, 'dist');
const localeIds = process.env.PDF_LOCALE ? [process.env.PDF_LOCALE] : Object.keys(MANUAL_LOCALES);
for (const locale of localeIds) {
	if (!Object.hasOwn(MANUAL_LOCALES, locale)) throw new Error(`Unsupported PDF locale: ${locale}`);
}
if (process.env.PDF_OUTPUT_PATH && localeIds.length !== 1) throw new Error('Set PDF_LOCALE when specifying PDF_OUTPUT_PATH.');
const port = Number(process.env.PDF_PREVIEW_PORT || 4329);
const host = '127.0.0.1';
const baseUrl = `http://${host}:${port}`;

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
	for (const locale of localeIds) {
		const language = MANUAL_LOCALES[locale];
		const outputPath = resolve(root, process.env.PDF_OUTPUT_PATH || (locale === 'en' ? 'dist/tier0-docs.pdf' : `dist/tier0-docs-${locale}.pdf`));
		const downloadName = `tier0-manual-${locale}.pdf`;
		const downloadPath = resolve(root, 'public/downloads', downloadName);
		const url = `${baseUrl}/${locale === 'en' ? '' : `${locale}/`}pdf/`;
		console.log(`Rendering PDF (${locale}) from ${url}`);
		const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
		// The static export includes third-party assets that may keep an HTTP connection open.
		// Wait explicitly for diagrams, images, and fonts instead of network-idle.
		const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
		if (!response?.ok()) throw new Error(`PDF source failed: ${url}: ${response?.status()}`);
		await page.evaluate(() => document.fonts.ready);
		try {
			await page.waitForFunction(
				() =>
					Array.from(document.querySelectorAll('pre.mermaid')).every((diagram) =>
						diagram.hasAttribute('data-processed')
					),
				undefined,
				{ timeout: 30000 }
			);
		} catch {
			throw new Error(`Mermaid diagrams did not finish rendering for ${locale}.`);
		}
		const missingImages = await page.evaluate(async () => {
			const images = Array.from(document.images);
			await Promise.all(images.map(async (image) => {
				image.loading = 'eager';
				try { await image.decode(); } catch { /* Report all failures together below. */ }
			}));
			await document.fonts.ready;
			return images.filter((image) => !image.naturalWidth).map((image) => image.src);
		});
		if (missingImages.length) throw new Error(`Missing PDF images (${locale}): ${missingImages.join(', ')}`);
		await page.evaluate(({ locale, tabLabel }) => {
			const routeToAnchor = new Map();
			const anchorToRoute = new Map();
			for (const article of document.querySelectorAll('article[data-route]')) {
				const route = article.dataset.route;
				for (const alias of [route, article.dataset.sourceRoute, locale === 'en' ? route : `${locale}/${route}`]) routeToAnchor.set(alias, article.id);
				anchorToRoute.set(article.id, article.dataset.sourceRoute);
				const localIds = new Map();
				for (const element of article.querySelectorAll('[id]')) {
					localIds.set(element.id, `${article.id}--${element.id}`);
					element.dataset.pdfOriginalId = element.id;
					element.id = `${article.id}--${element.id}`;
				}
				for (const element of article.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls], [for]')) {
					for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
						const value = element.getAttribute(attribute);
						if (value) element.setAttribute(attribute, value.split(/\s+/).map((id) => localIds.get(id) ?? id).join(' '));
					}
				}
			}
			routeToAnchor.set('reference/tier0-openapi', 'api-reference-appendix');
			routeToAnchor.set(`${locale}/reference/tier0-openapi`, 'api-reference-appendix');
			const normalizePath = (path) => path.replace(/^\/+|\/+$/g, '').replace(/\/index$/, '');

			for (const panel of document.querySelectorAll('[role="tabpanel"]')) {
				const labelId = panel.getAttribute('aria-labelledby');
				const label = labelId ? document.getElementById(labelId)?.textContent?.trim() : '';
				panel.removeAttribute('hidden');
				if (!panel.querySelector(':scope > .pdf-tab-label')) {
					const labelElement = document.createElement('div');
					labelElement.className = 'pdf-tab-label';
					labelElement.textContent = label ? `${tabLabel}: ${label}` : tabLabel;
					panel.prepend(labelElement);
				}
			}

			for (const details of document.querySelectorAll('details')) {
				details.open = true;
			}

			// Chromium derives PDF bookmarks from heading elements. Keep only the cover,
			// document-section, and document-title headings in that outline; the printed
			// body and OpenAPI headings retain their appearance but stay out of bookmarks.
			const copiedHeadingProperties = [
				'display', 'font-family', 'font-size', 'font-style', 'font-weight',
				'line-height', 'letter-spacing', 'color', 'background-color',
				'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
				'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
				'border-top', 'border-right', 'border-bottom', 'border-left',
				'break-after', 'break-before', 'break-inside', 'text-align', 'text-transform',
			];
			for (const heading of document.querySelectorAll('.sl-markdown-content :is(h1, h2, h3, h4, h5, h6), .pdf-api-appendix :is(h1, h2, h3, h4, h5, h6)')) {
				const style = window.getComputedStyle(heading);
				const replacement = document.createElement('div');
				replacement.className = heading.className;
				if (heading.id) replacement.id = heading.id;
				replacement.innerHTML = heading.innerHTML;
				for (const property of copiedHeadingProperties) {
					replacement.style.setProperty(property, style.getPropertyValue(property));
				}
				heading.replaceWith(replacement);
			}

			for (const link of document.querySelectorAll('a[href]')) {
				const rawHref = link.getAttribute('href');
				if (!rawHref) continue;
				if (rawHref.startsWith('#')) {
					const source = link.closest('article[data-route]');
					const originalId = decodeURIComponent(rawHref.slice(1));
					const target = Array.from(source?.querySelectorAll('[data-pdf-original-id]') ?? []).find((node) => node.dataset.pdfOriginalId === originalId);
					if (target) link.setAttribute('href', `#${target.id}`);
					continue;
				}
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
				if (!targetAnchor) {
					link.setAttribute('href', `https://docs.tier0.app${resolved.pathname}${resolved.search}${resolved.hash}`);
					continue;
				}

				if (resolved.hash) {
					const targetId = decodeURIComponent(resolved.hash.slice(1));
					const targetArticle = document.getElementById(targetAnchor);
					const targetElement = Array.from(targetArticle?.querySelectorAll('[data-pdf-original-id]') ?? []).find((node) => node.dataset.pdfOriginalId === targetId);
					link.setAttribute('href', targetElement ? `#${targetElement.id}` : `#${targetAnchor}`);
				} else {
					link.setAttribute('href', `#${targetAnchor}`);
				}
			}
		}, { locale, tabLabel: manualText(locale, 'Tab') });
		console.log(`Printing PDF (${locale})`);
		await page.emulateMedia({ media: 'print' });
		await page.pdf({
			path: outputPath,
			format: 'A4',
			printBackground: true,
			preferCSSPageSize: true,
			outline: true,
			tagged: true,
			displayHeaderFooter: true,
			headerTemplate: '<span></span>',
			footerTemplate: `
				<div style="width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 9px; color: #707070; text-align: center;">
					<span class="pageNumber"></span> / <span class="totalPages"></span>
				</div>
			`,
			margin: {
				top: '18mm',
				right: '16mm',
				bottom: '20mm',
				left: '16mm',
			},
		});
		const document = await PDFDocument.load(readFileSync(outputPath));
		const cover = await document.embedPng(readFileSync(resolve(root, 'public/pdf/tier0-manual-front-cover-light.png')));
		const back = await document.embedPng(readFileSync(resolve(root, 'public/pdf/tier0-manual-back-cover-light.png')));
		const logo = await document.embedPng(readFileSync(resolve(root, 'public/pdf/tier0-logo-black.png')));
		const firstPage = document.getPage(0);
		const { width, height } = firstPage.getSize();
		firstPage.drawImage(cover, { x: 0, y: 0, width, height });
		firstPage.drawRectangle({ x: 36, y: 704, width: 260, height: 115, color: rgb(1, 1, 1) });
		firstPage.drawImage(logo, { x: 46, y: 748, width: 190, height: 47 });
		const lastPage = document.addPage([width, height]);
		lastPage.drawImage(back, { x: 0, y: 0, width, height });
		lastPage.drawRectangle({ x: 36, y: 44, width: 260, height: 140, color: rgb(1, 1, 1) });
		lastPage.drawImage(logo, { x: 46, y: 104, width: 170, height: 42 });
		const urlFont = await document.embedFont('Helvetica');
		lastPage.drawText('tier0.app', { x: 46, y: 78, size: 15, font: urlFont, color: rgb(0.09, 0.09, 0.09) });
		const titled = await updateManualTitle(await document.save(), language.technicalTitle, { locale, rasterizeTitle: (title) => page.evaluate(rasterizeManualTitle, title) });
		writeFileSync(outputPath, titled);
		mkdirSync(resolve(root, 'public/downloads'), { recursive: true });
		copyFileSync(outputPath, downloadPath);
		const builtDownloadDir = resolve(distDir, 'downloads');
		mkdirSync(builtDownloadDir, { recursive: true });
		if (resolve(builtDownloadDir, downloadName) !== outputPath) copyFileSync(outputPath, resolve(builtDownloadDir, downloadName));
		if (locale === 'en') {
			copyFileSync(outputPath, resolve(root, 'public/downloads/tier0-manual.pdf'));
			copyFileSync(outputPath, resolve(builtDownloadDir, 'tier0-manual.pdf'));
		}
		console.log(`PDF exported (${locale}) to ${outputPath}`);
		await page.close();
	}
} finally {
	if (browser) await browser.close();
	await closeServer();
}
