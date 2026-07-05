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
					label: 'Get Started',
					collapsed: false,
					items: [
						{ label: 'Installation', slug: 'get-started/installation' },
						{ label: 'Try the Demo Factory', slug: 'get-started/demo-factory' },
						{ label: 'Choosing the Best Version', slug: 'get-started/choosing-version' },
					],
				},
				{
					label: 'Using Tier0',
					collapsed: false,
					items: [
						{ label: 'UNS Concepts', slug: 'using-tier0/uns-concepts' },
						{ label: 'Connect Data to UNS', slug: 'using-tier0/connect-data' },
						{ label: 'Working with UNS Data', slug: 'using-tier0/working-with-uns-data' },
						{ label: 'Build Apps on UNS', slug: 'using-tier0/build-apps' },
						{ label: 'Analyze UNS Data', slug: 'using-tier0/analyze-data' },
						{ label: 'Operate Tier0 with Agents', slug: 'using-tier0/agents' },
					],
				},
				{
					label: 'Best Practice',
					collapsed: false,
					items: [
						{ label: 'UNS Modeling', slug: 'best-practice/uns-modeling' },
						{ label: 'Connecting OPC UA / Modbus', slug: 'best-practice/protocol-connections' },
						{ label: 'Building Analytics Apps', slug: 'best-practice/analytics-apps' },
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
								'Everything that applies to the open-source Tier0 Edge edition: concepts, install, data collection, best practices',
							paths: [
								'get-started/**',
								'using-tier0/uns-concepts',
								'using-tier0/connect-data',
								'using-tier0/working-with-uns-data',
								'using-tier0/agents',
								'best-practice/uns-modeling',
								'best-practice/protocol-connections',
							],
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
