import { chromium } from 'playwright';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const sourceSvg = 'C:/Users/10517/Downloads/tier0-enterprise-six-vm-swarm-pgsql-tsdb-witness.en.svg';
const outputDir = path.join(root, 'public', 'images');
const browserCandidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

const translations = {
  en: {},
  'zh-cn': {
    'tier0-enterprise Six-VM North-South Data Path': 'tier0-enterprise 六虚拟机南北向数据请求链路',
    'Clients / Site Systems -> APP VIP -> Three Docker Swarm Nodes -> DB VIP -> Current Primary DB':
      '用户 / 现场系统 -> APP VIP -> 三台 Docker Swarm 基座 -> DB VIP -> 当前主库',
    'North-South Business Data Flow': '南北向业务数据流',
    'Clients / Site Systems': '用户 / 现场系统',
    'Business requests': '发起业务请求',
    'Floating entry across Swarm nodes': '入口漂移在三台 Swarm 节点间',
    'NFS / NAS Shared Storage': 'NFS / NAS 共享存储',
    'External dependency, not in 6 VMs': '外部依赖，不计入 6 台 VM',
    'APP VIP distributes requests to the three Swarm nodes': 'APP VIP 分发业务请求到三台 Swarm 节点',
    'tier0-enterprise is single-replica and movable; EMQX is stateful and must be pinned or clustered':
      'tier0 单副本可漂移；EMQX 需固定节点或集群化',
    'Shared files: uploads / imports / exports / reports': '共享文件：上传 / 导入 / 导出 / 报告',
    'Unified DB endpoint, points to current primary': '数据库统一入口，指向当前主库',
    'Swarm nodes access DB VIP over PostgreSQL 5432': 'Swarm 节点通过 PostgreSQL 5432 访问 DB VIP',
    'Database High Availability and Supervision': '数据库高可用与监督',
    'ent-db-01 Primary Candidate': 'ent-db-01 主库候选',
    'ent-db-02 Standby Candidate': 'ent-db-02 备库候选',
    'DB VIP points to primary, then floats to new primary after failover':
      'DB VIP 正常指向主库，故障后漂移到新主库',
    'WAL replication': 'WAL 复制',
    'Quorum / promotion / health checks': '仲裁 / 选主 / 健康检查',
    'North-south business data path': '南北向业务数据请求链路',
    'Replication / quorum / failover path': '复制 / 仲裁 / 故障切换链路',
    'VM count: 6 = 3 Swarm + 2 DB + 1 Witness': '虚拟机数量：6 = 3 Swarm + 2 DB + 1 Witness',
  },
  ja: {
    'tier0-enterprise Six-VM North-South Data Path': 'tier0-enterprise 6 VM 南北方向データパス',
    'Clients / Site Systems -> APP VIP -> Three Docker Swarm Nodes -> DB VIP -> Current Primary DB':
      'クライアント / 現場システム -> APP VIP -> 3 台の Docker Swarm ノード -> DB VIP -> 現在の Primary DB',
    'North-South Business Data Flow': '南北方向の業務データフロー',
    'Clients / Site Systems': 'クライアント / 現場システム',
    'Business requests': '業務リクエスト',
    'Floating entry across Swarm nodes': 'Swarm ノード間で移動する入口',
    'NFS / NAS Shared Storage': 'NFS / NAS 共有ストレージ',
    'External dependency, not in 6 VMs': '外部依存、6 VM には含めない',
    'APP VIP distributes requests to the three Swarm nodes': 'APP VIP が 3 台の Swarm ノードへ分散',
    'tier0-enterprise is single-replica and movable; EMQX is stateful and must be pinned or clustered':
      'tier0 は単一レプリカで移動可能、EMQX は固定またはクラスタ化',
    'Shared files: uploads / imports / exports / reports': '共有: upload / import / export / report',
    'Unified DB endpoint, points to current primary': '統一 DB 入口、現在の Primary を指す',
    'Swarm nodes access DB VIP over PostgreSQL 5432': 'Swarm ノードは PostgreSQL 5432 で DB VIP にアクセス',
    'Database High Availability and Supervision': 'データベース高可用性と監視',
    'ent-db-01 Primary Candidate': 'ent-db-01 Primary 候補',
    'ent-db-02 Standby Candidate': 'ent-db-02 Standby 候補',
    'DB VIP points to primary, then floats to new primary after failover':
      'DB VIP は Primary を指し、障害後に新 Primary へ移動',
    'WAL replication': 'WAL レプリケーション',
    'Quorum / promotion / health checks': 'クォーラム / 昇格 / ヘルスチェック',
    'North-south business data path': '南北業務データパス',
    'Replication / quorum / failover path': '複製 / クォーラム / フェイルオーバー',
    'VM count: 6 = 3 Swarm + 2 DB + 1 Witness': 'VM: 6 = 3 Swarm + 2 DB + 1 Witness',
  },
  ko: {
    'tier0-enterprise Six-VM North-South Data Path': 'tier0-enterprise 6 VM 남북 데이터 경로',
    'Clients / Site Systems -> APP VIP -> Three Docker Swarm Nodes -> DB VIP -> Current Primary DB':
      '클라이언트 / 현장 시스템 -> APP VIP -> Docker Swarm 노드 3대 -> DB VIP -> 현재 Primary DB',
    'North-South Business Data Flow': '남북 방향 업무 데이터 흐름',
    'Clients / Site Systems': '클라이언트 / 현장 시스템',
    'Business requests': '업무 요청',
    'Floating entry across Swarm nodes': 'Swarm 노드 간 이동하는 진입점',
    'NFS / NAS Shared Storage': 'NFS / NAS 공유 스토리지',
    'External dependency, not in 6 VMs': '외부 의존성, 6 VM에는 포함하지 않음',
    'APP VIP distributes requests to the three Swarm nodes': 'APP VIP가 3대 Swarm 노드로 분산',
    'tier0-enterprise is single-replica and movable; EMQX is stateful and must be pinned or clustered':
      'tier0는 단일 replica로 이동 가능, EMQX는 고정 또는 클러스터 구성',
    'Shared files: uploads / imports / exports / reports': '공유: upload / import / export / report',
    'Unified DB endpoint, points to current primary': '통합 DB 진입점, 현재 primary를 가리킴',
    'Swarm nodes access DB VIP over PostgreSQL 5432': 'Swarm 노드는 PostgreSQL 5432로 DB VIP에 접근',
    'Database High Availability and Supervision': '데이터베이스 고가용성 및 감독',
    'ent-db-01 Primary Candidate': 'ent-db-01 Primary 후보',
    'ent-db-02 Standby Candidate': 'ent-db-02 Standby 후보',
    'DB VIP points to primary, then floats to new primary after failover':
      'DB VIP는 primary를 가리키고 장애 후 새 primary로 이동',
    'WAL replication': 'WAL 복제',
    'Quorum / promotion / health checks': 'Quorum / 승격 / 상태 점검',
    'North-south business data path': '남북 업무 데이터 경로',
    'Replication / quorum / failover path': '복제 / quorum / failover',
    'VM count: 6 = 3 Swarm + 2 DB + 1 Witness': 'VM: 6 = 3 Swarm + 2 DB + 1 Witness',
  },
  es: {
    'tier0-enterprise Six-VM North-South Data Path': 'Ruta norte-sur de datos en tier0-enterprise con seis VM',
    'Clients / Site Systems -> APP VIP -> Three Docker Swarm Nodes -> DB VIP -> Current Primary DB':
      'Clientes / sistemas de sitio -> APP VIP -> tres nodos Docker Swarm -> DB VIP -> base de datos primaria actual',
    'North-South Business Data Flow': 'Flujo de datos de negocio norte-sur',
    'Clients / Site Systems': 'Clientes / sistemas de sitio',
    'Business requests': 'Solicitudes de negocio',
    'Floating entry across Swarm nodes': 'Entrada flotante entre nodos Swarm',
    'NFS / NAS Shared Storage': 'NFS / NAS compartido',
    'External dependency, not in 6 VMs': 'Dependencia externa, fuera de las 6 VM',
    'APP VIP distributes requests to the three Swarm nodes': 'APP VIP distribuye solicitudes a los nodos Swarm',
    'tier0-enterprise is single-replica and movable; EMQX is stateful and must be pinned or clustered':
      'tier0 usa réplica móvil; EMQX debe fijarse o ejecutarse en clúster',
    'Shared files: uploads / imports / exports / reports': 'Compartidos: cargas / imports / exports / informes',
    'Unified DB endpoint, points to current primary': 'Entrada DB unificada, apunta a la primaria',
    'Swarm nodes access DB VIP over PostgreSQL 5432': 'Los nodos Swarm acceden al DB VIP mediante PostgreSQL 5432',
    'Database High Availability and Supervision': 'Alta disponibilidad y supervisión de base de datos',
    'ent-db-01 Primary Candidate': 'ent-db-01 candidato primario',
    'ent-db-02 Standby Candidate': 'ent-db-02 candidato standby',
    'DB VIP points to primary, then floats to new primary after failover':
      'DB VIP apunta a la primaria y cambia tras failover',
    'WAL replication': 'Replicación WAL',
    'Quorum / promotion / health checks': 'Quórum / promoción / comprobaciones de salud',
    'North-south business data path': 'Ruta norte-sur de negocio',
    'Replication / quorum / failover path': 'Replicación / quórum / failover',
    'VM count: 6 = 3 Swarm + 2 DB + 1 Witness': 'VM: 6 = 3 Swarm + 2 DB + 1 Witness',
  },
};

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function translateSvg(source, dictionary) {
  let svg = source.replaceAll(
    'font: 700 30px Arial, sans-serif;',
    'font: 700 30px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );
  svg = svg.replaceAll(
    'font: 600 18px Arial, sans-serif;',
    'font: 600 18px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );
  svg = svg.replaceAll(
    'font: 700 20px Arial, sans-serif;',
    'font: 700 20px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );
  svg = svg.replaceAll(
    'font: 700 16px Arial, sans-serif;',
    'font: 700 16px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );
  svg = svg.replaceAll(
    'font: 500 13px Arial, sans-serif;',
    'font: 500 13px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );
  svg = svg.replaceAll(
    'font: 600 13px Arial, sans-serif;',
    'font: 600 13px "Microsoft YaHei", "Yu Gothic", "Meiryo", "Malgun Gothic", Arial, sans-serif;'
  );

  for (const [from, to] of Object.entries(dictionary)) {
    svg = svg.replace(new RegExp(`>${escapeRegExp(from)}<`, 'g'), `>${escapeHtml(to)}<`);
  }
  return svg;
}

async function renderPng(browser, svgPath, pngPath) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1260 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(svgPath).href);
  await page.screenshot({
    path: pngPath,
    fullPage: false,
    omitBackground: false,
    timeout: 90000,
  });
  await page.close();
}

const source = await fs.readFile(sourceSvg, 'utf8');
await fs.mkdir(outputDir, { recursive: true });

let executablePath;
for (const candidate of browserCandidates) {
  try {
    await fs.access(candidate);
    executablePath = candidate;
    break;
  } catch {
    // Try the next installed browser path.
  }
}

const browser = await chromium.launch(executablePath ? { executablePath } : undefined);
try {
  for (const [locale, dictionary] of Object.entries(translations)) {
    const svg = translateSvg(source, dictionary);
    const svgPath = path.join(outputDir, `enterprise-ha-topology.${locale}.svg`);
    const pngPath = path.join(outputDir, `enterprise-ha-topology.${locale}.png`);
    await fs.writeFile(svgPath, svg, 'utf8');
    await renderPng(browser, svgPath, pngPath);
    console.log(`generated ${path.relative(root, pngPath)}`);
  }
} finally {
  await browser.close();
}
