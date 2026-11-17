import { readFileSync, writeFileSync } from 'node:fs';

const base = 'public/openapi/';
const english = JSON.parse(readFileSync(`${base}tier0-cloud-v2.en.json`, 'utf8'));
const chinese = JSON.parse(readFileSync(`${base}tier0-cloud-v2.json`, 'utf8'));
const supplementaryTranslations = JSON.parse(readFileSync(`${base}tier0-cloud-v2.zh-cn-translations.json`, 'utf8'));
supplementaryTranslations['Page number actually used'] = '实际使用的页码';
supplementaryTranslations['Items per page actually used'] = '实际使用的每页条数';
function correct(prefix, translation) {
  const keys = Object.keys(supplementaryTranslations).filter((item) => item.startsWith(prefix));
  if (!keys.length) throw new Error(`Missing translation: ${prefix}`);
  for (const key of keys) supplementaryTranslations[key] = translation;
}
correct('Positive decimal int64 identifier', '正十进制 int64 标识符；传输时始终使用字符串。');
correct('Only directory, topic and collection are generic metadata kinds.', '只有 directory、topic 和 collection 是通用元数据类型。Source/Stream 写入须使用专用的 /uns/sources/documents/create、update、delete 和 /uns/streams/documents/create、update 生命周期接口。通用元数据接口不能配置凭据，也不能绕过依赖影响确认。');
correct('Use the resource catalog bounds. Only Salesforce', '遵循资源目录给出的取值范围。只有 Salesforce 对象查询支持每页原生读取 200 条。');
correct('Cloud extension: require inactive state', 'Cloud 扩展：要求处于非活动状态；与 expectedActiveVersion 互斥。');
correct('Cloud requires explicit expectedRevision', 'Cloud 要求明确提供 expectedRevision。仅当同一变更事务能证明不存在草稿、活动或历史 Stream 引用时，才可省略 confirmedImpactRevision。提供的确认始终绑定到确切操作意图及依赖集合；确认不能代替授权或幂等保护。');
correct('Update a single Source or atomic items batch', '使用完整文档或补丁及 CAS 更新单个 Source 或原子化的 items 批次。此接口不接受凭据内容；请使用 credentials/update。');
correct('Submit id, expectedRevision and action', '提交 id、expectedRevision 和 action。轮换凭据时使用 action=credentials，不传 document、patch 或密钥。检查所有返回的依赖项后，再明确将 confirmedImpactRevision 传给 credentials/update。此令牌绑定 ID、版本、依赖快照及操作，不包含随机凭据引用。不要自动确认影响。');
correct('Inspect Source update, delete, enable, disable', '检查 Source 更新、删除、启用、停用或凭据轮换的依赖项。只有更新操作接受且仅接受一个 document 或 patch；其他操作均不得包含 document、patch 或密钥。使用同一个 impactRevision 快照按 offset/size 翻页，检查依赖项后明确确认返回的令牌。');
correct('Delete the current Source using id', '使用 id 和 expectedRevision 删除当前 Source。需要时提交依赖影响确认。dryRun 仅验证，不提交变更。定位 Edge 节点时使用相同的原生文档约定。');
correct('Provision or rotate shared write-only credentials', '在 uns.source.credentials 权限和 source:manage 范围内，使用 Source ID 和 expectedRevision 配置或轮换共享的只写凭据。若存在依赖项，先通过 action=credentials 检查 sourceImpact，核对后明确提供 confirmedImpactRevision。可选的 Fleet 定位使用相同的原生请求。接口绝不返回凭据内容。');
correct('Required except unset, directly', '除 unset 外均为必填，可直接提供或通过明确的结果绑定提供。append/addToSet：包含 1–200 个元素的数组；pull：对每个元素求值的非空标量运算符或对象字段条件。');
correct('Declared data.* path.', '声明的 data.* 路径。字面量点号用 \\. 转义，反斜杠用 \\\\ 转义。允许明确指定数组索引；不支持隐式遍历或位置运算符。不能修改身份或版本字段。');
correct('Opaque existing credential reference', '为授权编辑返回的不透明现有凭据引用，也可作为输入。它不包含密钥。只能通过 create.credentials 或 credentials/update 配置密钥；文档绝不返回密钥内容。');
correct('Required explicitly on updates when any previous', '当原有或拟定的 Collection 授权包含 dataRule 时，更新必须明确提供此字段，包括删除和停用授权的情况。无此规则的策略可省略。');
correct('Latest durable RAW admission', '严格早于 checkedAt 的本版本最近一次持久 RAW 数据接收时间；若不存在则为 null。不受 24 小时统计窗口限制。');
correct('Source-owned named queries on Cloud', 'Cloud 和 Enterprise 上由 Source 定义的命名查询；不可覆盖 Stream 采集中的 SQL。PostgreSQL/MySQL 使用只读事务和有界读取。SQL Server 没有公开的预览或实时查询 dryRun；明确授权的 Stream 执行可能写入，并记录执行效果。没有命名查询扫描接口。limit 为 1–100；timeoutMs 为 100–10000。');
correct('Preset approved business SELECT', '预先批准的业务 SELECT，适用于 Cloud 和 Enterprise。Tool/WMS 预设要求 PostgreSQL；quality-inspections 要求 SQL Server。固定读取支持基于键集的扫描；必须验证完整 TLS。query 与 queries 互斥。');
correct('Active immutable release.', '当前活动的不可变发布版本。configRevision 是冻结的 Cloud Source 版本；sourceRevisionState 将其与 currentConfigRevision 比较。过期绑定在重新部署前仍可见。时间使用 Unix 毫秒。Collection 提交和运行错误汇总过去 24 小时内已结束的程序任务。仅计入包含 Collection 写入且已完成的事务。多 Source 程序省略输出、检查点和运行错误的归属信息。lastSourceCallAt 是主机调用成功完成时间。sourceReportedCollectedAt 为可选值，来自 Source 读取结果。检查点显示当前持久元数据，不包含状态值。edgeSubscriptions 包含 Edge 监听采集、ACK 和故障状态。');
correct('Fresh target Edge inventory.', '目标 Edge 节点的最新清单。checkedAt 是观测时间；revision 对设备与绑定状态计算哈希；complete=false 表示各类别发现结果中包含错误。devices 包含 deviceId、kind、label、address、canCreateSource、requiredParameters 和现有 Source。发现串口设备不代表支持串口采集。只有 complete=true 时，空 devices 才能证明没有设备。未取得用户提供的设备身份信息时，不得将任意 HID 键盘归类为扫码器。');
correct('OpenAPI 3.0 wire schema.', 'OpenAPI 3.0 传输层结构。数组的 contains/cardinality 注解和跨字段验证顺序需要结合共享 JSON Schema 与 SDK 语义检查；仅凭此处的投影不能完整验证接口约定。');
correct('Recipient display name (nickName', '接收者的显示名称（优先使用 nickName，否则使用 userName）；如果接收者不是此工作空间的成员，或暂时无法查询名称，则为空字符串。');
correct('Recipient display name (nickName, falling back to userName); an empty string when the recipient is not a member of this Workspace or the name cannot be looked up for now; never', '接收者的显示名称（优先使用 nickName，否则使用 userName）；如果接收者不是此工作空间的成员，或暂时无法查询名称，则为空字符串；不会影响发送结果。');
supplementaryTranslations.assetUpload = 'assetUpload';
supplementaryTranslations.getMembers = 'getMembers';
supplementaryTranslations.listAccessMembers = 'listAccessMembers';
const localizedKeys = new Set(['title', 'summary', 'description']);

function overlay(target, source) {
  if (!target || !source || typeof target !== 'object' || typeof source !== 'object') return;
  for (const [key, value] of Object.entries(target)) {
    if (key === 'tags' && Array.isArray(value) && Array.isArray(source[key])) {
      target[key] = source[key];
    } else if (localizedKeys.has(key) && typeof value === 'string') {
      target[key] = supplementaryTranslations[value] ?? (typeof source[key] === 'string' ? source[key] : value);
    } else if (value && typeof value === 'object') {
      overlay(value, source[key]);
    }
  }
}

overlay(english, chinese);
// This description is still English in the older Chinese source specification.
english.components.schemas.DocUnsV2EdgeNodesListResponse.properties.data.properties.list.items.properties.fleetNodeId.description =
  '调用原生 UNS 接口时，请将此字符串原样用作 X-Fleet-Node-Id 请求头的值。';
english.info.description = `云端集合、业务数据、时序数据及数据源、处理流与 App 策略管理接口。使用绑定工作空间的 API Key。

### UNS 接口错误

对于 \`/uns/\` 接口，请参阅 \`default\` 响应中的错误结构。具体原因以 \`error.code\` 为准。

| HTTP status | 含义 |
| --- | --- |
| \`401\` | 未认证或认证无效。 |
| \`403\` | 无权限或功能未开通。 |
| \`404\` | 对象不存在。 |
| \`409\` | 状态、版本、唯一键或凭据冲突。 |
| \`413\` | 请求内容超限。 |
| \`422\` | 参数或业务规则校验失败。 |
| \`429\` | 服务过载。 |
| \`500\` | 服务端错误。 |
| \`503\` | 服务暂不可用。 |
| \`504\` | 查询超时。 |

| \`error.execution\` | 含义 |
| --- | --- |
| \`notStarted\` | 尚未开始执行，没有提交变更。 |
| \`rolledBack\` | 执行已回滚，没有提交变更。 |
| \`committed\` | 变更已提交；批量操作需检查哪些项目成功。 |
| \`unknown\` | 服务器无法确认写入是否提交；仅用于写操作。 |

| Retry signal | 处理方式 |
| --- | --- |
| \`error.retry.safe: true\` | 原样重发请求；写操作如提供了幂等键，请复用原键。 |
| \`error.retry.safe: false\` | 先修正请求或恢复授权，再尝试重发。 |
| \`error.retry.afterMs\` 或 \`Retry-After\` | 至少等待指定时间后再重试。 |

### 平台接口

平台接口使用各接口说明中的响应格式。

| Endpoint | 响应格式 |
| --- | --- |
| 文件下载 | HTTP \`302\` 重定向。 |
| 通知、能力查询、Stream 请求和消息连接 | 直接返回 JSON 数据。 |
| 其他平台接口 | 包含 \`code\`、\`msg\` 和 \`data\` 的 JSON 结构。 |`;

writeFileSync(`${base}tier0-cloud-v2.zh-cn.json`, `${JSON.stringify(english, null, 2)}\n`);
