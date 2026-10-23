import { PDFDocument, PDFDict, PDFHexString, PDFName, StandardFonts, rgb } from 'pdf-lib';
import { MANUAL_LOCALES } from './manual-locales.js';

export const DEFAULT_MANUAL_TITLE = 'Tier0 Technical Guidance Manual';

export function toManualTitleCase(value) {
	return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US')
		.replace(/(^|[\s\-–—/])([\p{L}])/gu, (_, prefix, letter) => prefix + letter.toLocaleUpperCase('en-US'));
}

function titleLines(title, font, maxWidth, fontSize) {
	const words = title.split(' ');
	const lines = [];
	let line = '';
	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (line && font.widthOfTextAtSize(candidate, fontSize) > maxWidth) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	if (line) lines.push(line);
	return lines;
}

function setOutlineTitle(document, title, locale) {
	const outlines = document.catalog.lookup(PDFName.of('Outlines'), PDFDict);
	const first = outlines?.lookup(PDFName.of('First'), PDFDict);
	if (!first) throw new Error('The PDF is missing its manual bookmark.');
	let sectionRef = first.get(PDFName.of('First'));
	for (const expected of MANUAL_LOCALES[locale].sections) {
		if (!sectionRef) throw new Error(`The PDF is missing the ${expected} bookmark.`);
		const section = document.context.lookup(sectionRef, PDFDict);
		if (section.lookup(PDFName.of('Title'))?.decodeText() !== expected || !section.get(PDFName.of('First'))) {
			throw new Error(`The ${expected} bookmark hierarchy has changed.`);
		}
		sectionRef = section.get(PDFName.of('Next'));
	}
	if (sectionRef) throw new Error('The PDF has an unexpected top-level bookmark.');
	first.set(PDFName.of('Title'), PDFHexString.fromText(title));
}

export async function updateManualTitle(pdfBytes, rawTitle, { rasterizeTitle, locale = 'en' } = {}) {
	if (!Object.hasOwn(MANUAL_LOCALES, locale)) throw new Error('Unsupported manual language.');
	const title = rawTitle.trim().replace(/\s+/g, ' ');
	if (!title) throw new Error('Enter a cover title.');
	const document = await PDFDocument.load(pdfBytes);
	const page = document.getPage(0);
	const { width } = page.getSize();
	// The cover artwork reserves a plain paper field for the variable title.
	page.drawRectangle({ x: 34, y: 94, width: width - 68, height: 166, color: rgb(1, 1, 1) });
	if (rasterizeTitle) {
		const titleImage = await document.embedPng(await rasterizeTitle(title));
		const scale = Math.min((width - 92) / titleImage.width, 126 / titleImage.height);
		page.drawImage(titleImage, { x: 46, y: 126, width: titleImage.width * scale, height: titleImage.height * scale });
	} else {
		const font = await document.embedFont(StandardFonts.HelveticaBold);
		let fontSize = 39;
		let lines = titleLines(title, font, width - 92, fontSize);
		while ((lines.length > 3 || lines.some((line) => font.widthOfTextAtSize(line, fontSize) > width - 92)) && fontSize > 20) {
			fontSize -= 1;
			lines = titleLines(title, font, width - 92, fontSize);
		}
		lines.slice(0, 3).forEach((line, index) => {
			page.drawText(line, { x: 46, y: 220 - index * (fontSize + 5), size: fontSize, font, color: rgb(0.09, 0.09, 0.09) });
		});
	}
	setOutlineTitle(document, title, locale);
	document.catalog.set(PDFName.of('Lang'), PDFHexString.fromText(MANUAL_LOCALES[locale].lang));
	document.setTitle(title);
	return document.save();
}

// Shared by the browser download flow and the build-time Playwright exporter.
// Keep this function self-contained so it can run through page.evaluate().
export function rasterizeManualTitle(title) {
	const canvas = document.createElement('canvas');
	canvas.width = 1600;
	canvas.height = 430;
	const context = canvas.getContext('2d');
	if (!context) throw new Error('Canvas is unavailable.');
	context.fillStyle = '#171717';
	let size = 130;
	let lines = [];
	const segments = Array.from(new Intl.Segmenter(undefined, { granularity: 'word' }).segment(title), (part) => part.segment);
	while (size >= 34) {
		context.font = `700 ${size}px system-ui, sans-serif`;
		lines = [];
		let line = '';
		for (const segment of segments) {
			const parts = context.measureText(segment).width > 1560 ? Array.from(segment) : [segment];
			for (const part of parts) {
				if (line && context.measureText(line + part).width > 1560) {
					lines.push(line.trim());
					line = part.trimStart();
				} else line += part;
			}
		}
		if (line) lines.push(line.trim());
		if (lines.length <= 3) break;
		size -= 4;
	}
	lines.slice(0, 3).forEach((line, index) => context.fillText(line, 8, 100 + index * (size + 20)));
	return canvas.toDataURL('image/png');
}
