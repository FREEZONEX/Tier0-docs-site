/** @returns {import('astro').AstroIntegration} */
export default function mermaidEdgeLabels() {
	return {
		name: 'mermaid-edge-labels',
		hooks: {
			'astro:config:setup': ({ injectScript }) => {
				injectScript('page', `
function parseEdgePoints(path) {
	const encoded = path.getAttribute('data-points');
	if (encoded) {
		try {
			return JSON.parse(atob(encoded));
		} catch {
			return null;
		}
	}

	const d = path.getAttribute('d');
	if (!d) return null;

	const numbers = d.match(/-?[\\d.]+/g);
	if (!numbers || numbers.length < 4) return null;

	return [
		{ x: Number(numbers[0]), y: Number(numbers[1]) },
		{ x: Number(numbers[numbers.length - 2]), y: Number(numbers[numbers.length - 1]) },
	];
}

function fitSvgViewBox(svg, pad) {
	const padValue = pad ?? 6;
	const current = svg.viewBox.baseVal;
	let minX = current.x;
	let minY = current.y;
	let maxX = current.x + current.width;
	let maxY = current.y + current.height;

	for (const edgeLabel of svg.querySelectorAll('g.edgeLabel')) {
		const outer = edgeLabel.getAttribute('transform')?.match(/translate\\(([-\\d.]+),\\s*([-\\d.]+)\\)/);
		if (!outer) continue;

		const anchorX = Number(outer[1]);
		const anchorY = Number(outer[2]);
		const labelInner = edgeLabel.querySelector('.label');
		const inner = labelInner?.getAttribute('transform')?.match(/translate\\(([-\\d.]+),\\s*([-\\d.]+)\\)/);
		if (!inner) continue;

		const offsetX = Number(inner[1]);
		const offsetY = Number(inner[2]);
		const foreignObject = labelInner.querySelector('foreignObject');
		const labelWidth = Number(foreignObject?.getAttribute('width')) || 0;
		const labelHeight = Number(foreignObject?.getAttribute('height')) || 0;
		const left = anchorX + offsetX;
		const top = anchorY + offsetY;

		minX = Math.min(minX, left);
		minY = Math.min(minY, top);
		maxX = Math.max(maxX, left + labelWidth);
		maxY = Math.max(maxY, top + labelHeight);
	}

	svg.setAttribute(
		'viewBox',
		[
			minX - padValue,
			minY - padValue,
			maxX - minX + padValue * 2,
			maxY - minY + padValue * 2,
		].join(' '),
	);
}

function adjustMermaidEdgeLabels(root) {
	const svg = root.querySelector('svg');
	if (!svg) return;

	const paths = svg.querySelectorAll('path.flowchart-link[data-id], path.edge-thickness-normal[data-id]');
	const lineGap = 4;
	const sideGap = 8;

	for (const path of paths) {
		const id = path.getAttribute('data-id');
		if (!id) continue;

		const labelInner = svg.querySelector('g.edgeLabel .label[data-id="' + id + '"]');
		if (!labelInner) continue;

		const points = parseEdgePoints(path);
		if (!points || points.length < 2) continue;

		const start = points[0];
		const end = points[points.length - 1];
		const dx = end.x - start.x;
		const dy = end.y - start.y;

		const foreignObject = labelInner.querySelector('foreignObject');
		const labelWidth = foreignObject ? Number(foreignObject.getAttribute('width')) || 60 : 60;
		const labelHeight = foreignObject ? Number(foreignObject.getAttribute('height')) || 24 : 24;

		const preferSide =
			Math.abs(dy) >= Math.abs(dx) ||
			(dy > 0 && Math.abs(dx) > Math.abs(dy) * 0.9 && Math.abs(dy) > 80);

		if (preferSide) {
			const placeRight = dx > 0;
			const offsetX = placeRight ? sideGap : -labelWidth - sideGap;
			labelInner.setAttribute(
				'transform',
				'translate(' + offsetX + ', ' + (-labelHeight / 2) + ')',
			);
		} else {
			const below = dy > 0;
			const offsetY = below ? lineGap : -labelHeight - lineGap;
			labelInner.setAttribute(
				'transform',
				'translate(' + (-labelWidth / 2) + ', ' + offsetY + ')',
			);
		}
	}

	fitSvgViewBox(svg, 6);

	// Keep intrinsic diagram size; narrow viewports scroll instead of shrinking text.
	const viewBox = svg.viewBox?.baseVal;
	if (viewBox && viewBox.width > 0) {
		svg.setAttribute('width', String(Math.ceil(viewBox.width)));
		if (viewBox.height > 0) {
			svg.setAttribute('height', String(Math.ceil(viewBox.height)));
		}
	}
}

function adjustAllMermaidEdgeLabels() {
	document.querySelectorAll('pre.mermaid[data-processed]').forEach(adjustMermaidEdgeLabels);
}

function scheduleAdjust() {
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			adjustAllMermaidEdgeLabels();
			// Mermaid can reset svg width="100%" after the first paint.
			setTimeout(adjustAllMermaidEdgeLabels, 50);
			setTimeout(adjustAllMermaidEdgeLabels, 250);
		});
	});
}

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		if (
			mutation.type === 'attributes' &&
			mutation.attributeName === 'data-processed' &&
			mutation.target.matches?.('pre.mermaid[data-processed]')
		) {
			scheduleAdjust();
			return;
		}

		if (mutation.type === 'childList') {
			for (const node of mutation.addedNodes) {
				if (
					node instanceof Element &&
					(node.matches('pre.mermaid[data-processed]') ||
						node.querySelector?.('pre.mermaid[data-processed] svg'))
				) {
					scheduleAdjust();
					return;
				}
			}
		}
	}
});

observer.observe(document.documentElement, {
	subtree: true,
	childList: true,
	attributes: true,
	attributeFilter: ['data-processed'],
});

document.addEventListener('astro:after-swap', scheduleAdjust);
scheduleAdjust();
`);
			},
		},
	};
}
