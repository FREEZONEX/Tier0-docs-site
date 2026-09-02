// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightDocSearch from '@astrojs/starlight-docsearch';
import starlightLlmsTxt from 'starlight-llms-txt';
import mermaid from 'astro-mermaid';
import mermaidEdgeLabels from './src/integrations/mermaid-edge-labels.mjs';

const algoliaConfig = {
	clientOptionsModule: './src/config/docsearch.ts',
};

// https://astro.build/config
export default defineConfig({
	// Update if the docs are served elsewhere. Required by starlight-llms-txt.
	site: 'https://docs.tier0.app',
	vite: {
		server: {
			proxy: {
				'/docsbot-chat': {
					target: 'https://docsbot.tier0.app',
					changeOrigin: true,
					secure: true,
					rewrite: (path) => path.replace(/^\/docsbot-chat/, '/chat'),
				},
			},
		},
	},
	integrations: [
		// Must come before starlight so it owns the mermaid code fences.
		mermaid({
			autoTheme: true,
			mermaidConfig: {
				flowchart: {
					curve: 'linear',
					nodeSpacing: 16,
					rankSpacing: 24,
					padding: 8,
					useMaxWidth: false,
				},
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
			favicon: '/favicon.svg?v=t0-20260722',
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
			lastUpdated: true,
			pagefind: false,
			expressiveCode: {
				themes: ['vitesse-dark', 'vitesse-light'],
				defaultProps: {
					frame: 'terminal',
				},
			},
			components: {
				Head: './src/components/Head.astro',
				Header: './src/components/Header.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				PageTitle: './src/components/PageTitle.astro',
				LastUpdated: './src/components/LastUpdated.astro',
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
							label: 'Choosing the Best Product',
							translations: { 'zh-CN': '选择合适的版本', ja: '最適なエディションの選択', es: 'Elegir la mejor versión', ko: '최적 버전 선택' },
							slug: 'get-started/choosing-version',
						},
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
						
					],
				},
				{
					label: 'Using Tier0',
					translations: { 'zh-CN': '使用 Tier0', ja: 'Tier0 の使い方', es: 'Uso de Tier0', ko: 'Tier0 사용' },
					collapsed: false,
					items: [
						{
							label: 'Factory Data Modeling',
							translations: { 'zh-CN': '工厂数据基础', ja: '工場データ基盤', es: 'Base de datos de fábrica', ko: '공장 데이터 기반' },
							slug: 'using-tier0/uns-concepts',
						},
						{
							label: 'Preparing Data Foundation',
							translations: { 'zh-CN': '准备数据基础', ja: 'データ基盤を準備する', es: 'Preparar la base de datos', ko: '데이터 기반 준비' },
							slug: 'using-tier0/connect-data',
						},
						{
							label: 'Manage Data from Center to Edge',
							translations: { 'zh-CN': '从中心到边缘管理数据', ja: 'センターからエッジのデータを管理する', es: 'Gestionar datos del centro al edge', ko: '센터에서 엣지까지 데이터 관리' },
							slug: 'using-tier0/fleet-management',
						},
						{
							label: 'Working with Factory Data',
							translations: { 'zh-CN': '操作工厂数据', ja: '工場データを扱う', es: 'Trabajar con datos de fábrica', ko: '공장 데이터 작업' },
							slug: 'using-tier0/working-with-uns-data',
						},
						{
							label: 'Building Apps',
							translations: { 'zh-CN': '构建应用', ja: 'アプリを構築する', es: 'Crear apps', ko: '앱 구축하기' },
							slug: 'using-tier0/build-apps',
						},
						{
							label: 'Visualizing Data',
							translations: { 'zh-CN': '可视化数据', ja: 'データを可視化する', es: 'Visualizar datos', ko: '데이터 시각화' },
							slug: 'using-tier0/digital-twin',
						},
						{
							label: 'Analyzing Data',
							translations: { 'zh-CN': '分析数据', ja: '工場データを分析する', es: 'Analizar datos de fábrica', ko: '공장 데이터 분석' },
							slug: 'using-tier0/analyze-data',
						},
						{
							label: 'Operating on Tier0 with Agents',
							translations: { 'zh-CN': '用 Agents 操作 Tier0', ja: 'Agents で Tier0 を操作する', es: 'Operar Tier0 con Agents', ko: 'Agent로 Tier0 운영' },
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
							label: 'Modeling Factory Data',
							translations: { 'zh-CN': '工厂数据建模', ja: '工場データをモデリングする', es: 'Modelar datos de fábrica', ko: '공장 데이터 모델링' },
							slug: 'best-practice/uns-modeling',
						},
						{
							label: 'Connecting Industrial Protocols',
							translations: { 'zh-CN': '连接工业协议', ja: '産業プロトコルの接続', es: 'Conectar protocolos industriales', ko: '산업 프로토콜 연결' },
							slug: 'best-practice/protocol-connections',
						},
						// {
						// 	label: 'Building Shopfloor Workflow with Agent',
						// 	translations: { 'zh-CN': '用 Agent 构建车间工作流', ja: 'Agent で現場ワークフローを構築する', es: 'Crear flujos de planta con Agent', ko: 'Agent로 현장 워크플로 구축하기' },
						// 	slug: 'best-practice/building-data-workflow-with-agent',
						// },
						{
							label: 'Building Analytics Apps',
							translations: { 'zh-CN': '构建分析应用', ja: '分析アプリの構築', es: 'Apps de analítica', ko: '분석 앱 구축' },
							slug: 'best-practice/analytics-apps',
						},
						{
							label: 'Displaying Data with Digital Twin',
							translations: { 'zh-CN': '使用数字孪生展示工厂数据', ja: 'Digital Twin で工場データを表示する', es: 'Mostrar datos de fábrica con Digital Twin', ko: 'Digital Twin으로 공장 데이터 표시하기' },
							slug: 'best-practice/view-uns-with-digital-twin',
						},
					],
				},
				{
					label: 'Reference',
					translations: { 'zh-CN': '参考资料', ja: 'リファレンス', es: 'Referencia', ko: '참조' },
					collapsed: true,
					items: [
						{
							label: 'API Reference',
							translations: { 'zh-CN': 'API 参考', ja: 'API リファレンス', es: 'Referencia de API', ko: 'API 참조' },
							slug: 'reference/api-reference',
						},
						{
							label: 'CLI Command Reference',
							translations: { 'zh-CN': 'CLI 命令参考', ja: 'CLI コマンドリファレンス', es: 'Referencia de comandos CLI', ko: 'CLI 명령 참조' },
							slug: 'reference/skill-reference',
						},
						{
							label: 'Embedded Builder Skills',
							translations: { 'zh-CN': '内置 Builder Skills', ja: '組み込み Builder Skills', es: 'Skills integradas de Builder', ko: '내장 Builder Skills' },
							slug: 'reference/embedded-builder-skills',
						},
						{
							label: 'ISA-95 Equipment Hierarchy',
							translations: { 'zh-CN': 'ISA-95 设备层级', ja: 'ISA-95 設備階層', es: 'Jerarquía de equipos ISA-95', ko: 'ISA-95 설비 계층' },
							slug: 'reference/isa-95-equipment-hierarchy',
						},
						{
							label: 'High Availability Deployment Plan',
							translations: { 'zh-CN': '高可用部署计划', ja: '高可用性デプロイ計画', es: 'Plan de despliegue de alta disponibilidad', ko: '고가용성 배포 계획' },
							slug: 'reference/high-availability-deployment',
						},
						{
							label: 'SLA and High Availability Boundaries',
							translations: { 'zh-CN': 'SLA 与高可用边界', ja: 'SLA と高可用性の範囲', es: 'SLA y límites de alta disponibilidad', ko: 'SLA 및 고가용성 범위' },
							slug: 'reference/sla-and-ha-boundaries',
						},
						{
							label: 'Standard Port List',
							translations: { 'zh-CN': '标准端口列表', ja: '標準ポート一覧', es: 'Lista estándar de puertos', ko: '표준 포트 목록' },
							slug: 'reference/standard-port-list',
						},
						{
							label: 'Operations Runbook',
							translations: { 'zh-CN': '运维 Runbook', ja: '運用 Runbook', es: 'Runbook de operaciones', ko: '운영 Runbook' },
							slug: 'reference/operations-runbook',
						},
					],
				},
			],
			plugins: [
				starlightDocSearch(algoliaConfig),
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
