// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import mermaid from 'astro-mermaid';
import mermaidEdgeLabels from './src/integrations/mermaid-edge-labels.mjs';

// https://astro.build/config
export default defineConfig({
	// Update if the docs are served elsewhere. Required by starlight-llms-txt.
	site: 'https://docs.tier0.app',
	integrations: [
		// Must come before starlight so it owns the mermaid code fences.
		mermaid({
			autoTheme: true,
			mermaidConfig: {
				flowchart: { curve: 'linear', nodeSpacing: 16, rankSpacing: 24, padding: 8 },
				fontFamily:
					"'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
				themeVariables: {
					fontSize: '16px',
				},
			},
		}),
		mermaidEdgeLabels(),
		starlight({
			title: 'Tier0 Docs',
			description:
				'Documentation for Tier0 — the agentic industrial platform that unifies industrial signals into one real-time Unified Namespace for apps, analytics, and AI.',
			logo: {
				light: './src/assets/tier0-logo-black.svg',
				dark: './src/assets/tier0-logo-white.svg',
				replacesTitle: true,
			},
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				'zh-cn': { label: '简体中文', lang: 'zh-CN' },
				ja: { label: '日本語', lang: 'ja' },
				es: { label: 'Español', lang: 'es' },
				ko: { label: '한국어', lang: 'ko' },
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
				defaultProps: {
					frame: 'terminal',
				},
			},
			components: {
				Head: './src/components/Head.astro',
				Header: './src/components/Header.astro',
				PageTitle: './src/components/PageTitle.astro',
				Pagination: './src/components/Pagination.astro',
			},
			customCss: [
				'@fontsource/ibm-plex-sans/400.css',
				'@fontsource/ibm-plex-sans/500.css',
				'@fontsource/ibm-plex-sans/700.css',
				'@fontsource/ibm-plex-mono/400.css',
				'@fontsource/ibm-plex-mono/500.css',
				'@fontsource/source-code-pro/400.css',
				'@fontsource/source-code-pro/500.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Get Started',
					translations: { 'zh-CN': '快速开始', ja: 'はじめに', es: 'Primeros pasos', ko: '시작하기' },
					collapsed: false,
					items: [
						{
							label: 'Installation',
							translations: { 'zh-CN': '安装', ja: 'インストール', es: 'Instalación', ko: '설치' },
							slug: 'get-started/installation',
						},
						{
							label: 'Try the Demo Factory',
							translations: { 'zh-CN': '体验演示工厂', ja: 'デモファクトリーを試す', es: 'Prueba la fábrica demo', ko: '데모 팩토리 체험' },
							slug: 'get-started/demo-factory',
						},
						{
							label: 'Choosing the Best Version',
							translations: { 'zh-CN': '选择最合适的版本', ja: '最適なエディションの選択', es: 'Elegir la mejor versión', ko: '최적 버전 선택' },
							slug: 'get-started/choosing-version',
						},
					],
				},
				{
					label: 'Using Tier0',
					translations: { 'zh-CN': '使用 Tier0', ja: 'Tier0 の使い方', es: 'Uso de Tier0', ko: 'Tier0 사용' },
					collapsed: false,
					items: [
						{
							label: 'UNS Concepts',
							translations: { 'zh-CN': 'UNS 核心概念', ja: 'UNS の概念', es: 'Conceptos de UNS', ko: 'UNS 개념' },
							slug: 'using-tier0/uns-concepts',
						},
						{
							label: 'Connect Data to UNS',
							translations: { 'zh-CN': '连接数据到 UNS', ja: 'UNS へのデータ接続', es: 'Conectar datos a UNS', ko: 'UNS에 데이터 연결' },
							slug: 'using-tier0/connect-data',
						},
						{
							label: 'Working with UNS Data',
							translations: { 'zh-CN': '使用 UNS 数据', ja: 'UNS データの操作', es: 'Trabajar con datos de UNS', ko: 'UNS 데이터 작업' },
							slug: 'using-tier0/working-with-uns-data',
						},
						{
							label: 'Build Apps on UNS',
							translations: { 'zh-CN': '在 UNS 上构建应用', ja: 'UNS 上でアプリを構築', es: 'Crear apps sobre UNS', ko: 'UNS 기반 앱 구축' },
							slug: 'using-tier0/build-apps',
						},
						{
							label: 'Analyze UNS Data',
							translations: { 'zh-CN': '分析 UNS 数据', ja: 'UNS データの分析', es: 'Analizar datos de UNS', ko: 'UNS 데이터 분석' },
							slug: 'using-tier0/analyze-data',
						},
						{
							label: 'Operate Tier0 with Agents',
							translations: { 'zh-CN': '用 Agent 操作 Tier0', ja: 'エージェントで Tier0 を操作', es: 'Operar Tier0 con agentes', ko: 'Agent로 Tier0 운영' },
							slug: 'using-tier0/agents',
						},
					],
				},
				{
					label: 'Best Practice',
					translations: { 'zh-CN': '最佳实践', ja: 'ベストプラクティス', es: 'Buenas prácticas', ko: '베스트 프랙티스' },
					collapsed: false,
					items: [
						{
							label: 'UNS Modeling',
							translations: { 'zh-CN': 'UNS 建模', ja: 'UNS モデリング', es: 'Modelado de UNS', ko: 'UNS 모델링' },
							slug: 'best-practice/uns-modeling',
						},
						{
							label: 'Connecting OPC UA / Modbus',
							translations: { 'zh-CN': '连接 OPC UA / Modbus', ja: 'OPC UA / Modbus 接続', es: 'Conexión OPC UA / Modbus', ko: 'OPC UA / Modbus 연결' },
							slug: 'best-practice/protocol-connections',
						},
						{
							label: 'Building Analytics Apps',
							translations: { 'zh-CN': '开发数据分析应用', ja: '分析アプリの構築', es: 'Apps de analítica', ko: '분석 앱 구축' },
							slug: 'best-practice/analytics-apps',
						},
					],
				},
				{
					label: 'Reference',
					collapsed: false,
					items: [
						{
							label: 'API Reference',
							slug: 'reference/api-reference',
						},
						{
							label: 'Skill Reference',
							slug: 'reference/skill-reference',
						},
						{
							label: 'High Availability Deployment Plan',
							slug: 'reference/high-availability-deployment',
						},
						{
							label: 'SLA and High Availability Boundaries',
							slug: 'reference/sla-and-ha-boundaries',
						},
						{
							label: 'Standard Port List',
							slug: 'reference/standard-port-list',
						},
						{
							label: 'Operations Runbook',
							slug: 'reference/operations-runbook',
						},
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
