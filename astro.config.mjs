// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	// Update if the docs are served elsewhere. Required by starlight-llms-txt.
	site: 'https://docs.tier0.app',
	integrations: [
		// Must come before starlight so it owns the mermaid code fences.
		mermaid({
			autoTheme: true,
			mermaidConfig: {
				flowchart: { curve: 'linear' },
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
				themeVariables: {
					fontSize: '15px',
				},
			},
		}),
		starlight({
			title: 'Tier0 Docs',
			description:
				'Documentation for Tier0 — the agentic industrial platform that unifies industrial signals into one real-time Unified Namespace for apps, analytics, and AI.',
			logo: {
				light: './src/assets/tier0-logo-black.svg',
				dark: './src/assets/tier0-logo-white.svg',
				replacesTitle: true,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/FREEZONEX' },
				{ icon: 'discord', label: 'Discord', href: 'https://tier0.app/media' },
			],
			editLink: {
				baseUrl: 'https://github.com/FREEZONEX/Tier0-docs-site/edit/main/',
			},
			expressiveCode: {
				themes: ['vitesse-dark', 'vitesse-light'],
			},
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			customCss: [
				'@fontsource/source-code-pro/400.css',
				'@fontsource/source-code-pro/500.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Intro',
					collapsed: false,
					items: [
						{ label: 'What is Tier0', slug: 'intro/what-is-tier0' },
						{ label: 'Get Started', slug: 'intro/get-started' },
					],
				},
				{
					label: 'Architecture',
					collapsed: false,
					items: [
						{ label: 'Choosing the Best Version', slug: 'architecture/choosing-version' },
						{ label: 'Hosting Tier0', slug: 'architecture/hosting' },
					],
				},
				{
					label: 'Using Tier0',
					collapsed: false,
					items: [
						{ label: 'Connect', slug: 'using-tier0/connect' },
						{ label: 'Build', slug: 'using-tier0/build' },
						{ label: 'Analytics', slug: 'using-tier0/analytics' },
						{ label: 'Front-Line User', slug: 'using-tier0/front-line-user' },
					],
				},
			],
			plugins: [
				starlightLlmsTxt({
					projectName: 'Tier0',
					description:
						'Tier0 is an agentic industrial platform: a Unified Namespace (UNS) for real-time industrial data, flow-based data collection, an AI app builder, notebooks for analytics, and a launchpad for front-line users.',
					details:
						'Tier0 is built by FREEZONEX. The UNS organizes data semantically (site / area / equipment / process / order) over MQTT pub/sub. Interact with the platform via the web UI or the `tier0` CLI (npm: @tier0/cli, GitHub: FREEZONEX/Tier0-cli). Agent skills are available via `npx skills add FREEZONEX/Tier0-skill`.',
					customSets: [
						{
							label: 'Edge (open-source) essentials',
							description:
								'Everything that applies to the open-source Tier0 Edge edition: concepts, install, data collection',
							paths: ['intro/**', 'architecture/**', 'using-tier0/connect'],
						},
					],
					optionalLinks: [
						{
							label: 'Tier0 website',
							url: 'https://tier0.app',
							description: 'Product overview, solutions, and pricing',
						},
						{
							label: 'Tier0 CLI on GitHub',
							url: 'https://github.com/FREEZONEX/Tier0-cli',
							description: 'CLI source, install scripts, and issues',
						},
						{
							label: 'Tier0-Edge on GitHub',
							url: 'https://github.com/FREEZONEX/Tier0-Edge',
							description: 'Open-source edge edition: source, README, install',
						},
					],
				}),
			],
		}),
	],
});
