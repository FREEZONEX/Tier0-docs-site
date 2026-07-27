import type { DocSearchClientOptions } from '@astrojs/starlight-docsearch';
import type { DocSearchHit } from '@docsearch/react';

const LOCALE_PREFIXES = ['/zh-cn/', '/ja/', '/es/', '/ko/'];

function currentLocalePrefix() {
	if (typeof window === 'undefined') return null;
	const pathname = window.location.pathname;
	return LOCALE_PREFIXES.find((prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)) || '/';
}

function getHitPath(hit: DocSearchHit) {
	try {
		return new URL(hit.url).pathname;
	} catch {
		return hit.url || '';
	}
}

function matchesCurrentLocale(hit: DocSearchHit) {
	const localePrefix = currentLocalePrefix();
	if (!localePrefix) return true;

	const hitPath = getHitPath(hit);
	if (localePrefix === '/') {
		return !LOCALE_PREFIXES.some((prefix) => hitPath.startsWith(prefix));
	}

	return hitPath.startsWith(localePrefix);
}

function localizeHitUrl(hit: DocSearchHit) {
	if (typeof window === 'undefined') return hit;

	try {
		const url = new URL(hit.url);
		return {
			...hit,
			url: `${window.location.origin}${url.pathname}${url.search}${url.hash}`,
		};
	} catch {
		return hit;
	}
}

export default {
	appId: 'STRRFG9NMH',
	apiKey: '4434f0f1f964c1ac1bc40746409ff612',
	indexName: 'docs_tier0_app_strrfg9nmh_articles',
	disableUserPersonalization: true,
	maxResultsPerGroup: 10,
	searchParameters: {
		hitsPerPage: 50,
	},
	transformItems(items) {
		return items.filter(matchesCurrentLocale).map(localizeHitUrl);
	},
} satisfies DocSearchClientOptions;
