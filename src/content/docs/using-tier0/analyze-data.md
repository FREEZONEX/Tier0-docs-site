---
title: Analyze UNS Data
description: Query live namespace data in Tier0 Notebook and build interactive analyses and machine-learning apps. Available in Cloud and Enterprise.
editions: [cloud, enterprise]
sidebar:
  order: 5
---

:::caution[TODO — 写作线索 (Huize)]
这部分讲**如何使用 Notebook 查询数据,并构建交互式分析、机器学习应用**。现有内容(下方)可作素材改写。建议补充:① Notebook 查询 UNS 的具体方式(内置数据接口/SQL/Python 示例);② 交互式分析——marimo 的响应式单元、控件(滑块/下拉)驱动的探索;③ ML 应用——训练→推理→结果回写 UNS 的闭环示例;④ 案例入口指向 [Best Practice: Building Analytics Apps](/best-practice/analytics-apps/)。
:::

:::note[Edge edition]
Tier0 Notebook is not part of the open-source Edge edition. On Edge, query history via the CLI (`tier0 uns history`) or connect your own tooling — the notebook engine is built on the open-source [marimo](https://github.com/FREEZONEX/marimo) project.
:::

**Tier0 Notebook** is the analytics workspace: explore, calculate, visualize, and operationalize industrial data — connected **live** to the Unified Namespace. No exports, no stale CSVs, no rebuilding context by hand.

## Why it's different from "a notebook"

The hard part of industrial analysis is rarely the math — it's assembling context: pulling historian tags, matching them to MES orders, aligning timestamps, re-doing it all next week. In Tier0 the context already exists in the namespace, so a single cell can:

- group by asset and time window,
- join historian-style metrics with order/batch context,
- plot the trend,

because equipment, process, and business data share one semantic structure. Code, charts, logic, and explanation live in one document.

## Working with data

Everything you connected in [Connect Data to UNS](/using-tier0/connect-data/) and everything your apps record is queryable — raw edge signals, MES-class records, and contextualized layers alike.

From notebooks you analyze live topics; the same data is reachable from the CLI when you're scripting or agent-driven:

```bash
# current value
tier0 uns read Plant/Line1/Metric/Temperature

# time series for a window (epoch seconds)
tier0 uns history Plant/Line1/Metric/Temperature --start 1715000000 --end 1715600000
```

## From insight to operation

Analysis that stays in a notebook decays. Tier0 notebooks are built to be **operationalized** — results feed:

- **Apps** — a computed KPI becomes a dashboard field
- **Alerts** — a threshold crossing notifies the right role
- **Workflows** — an anomaly opens a maintenance request
- **AI models** — clean, contextualized inputs instead of ad-hoc extracts

Build the analysis once, keep it running against live data, and let operations consume the output.

## Typical use cases

- Predictive maintenance and anomaly detection
- Quality root-cause analysis and yield optimization
- Process parameter optimization
- Energy consumption analysis and benchmarking
- OEE and production performance tracking
- Cross-system investigations ("why does line 2 drift every Tuesday?")

## Next

- [Build Apps on UNS](/using-tier0/build-apps/) — where operationalized insights land
- [UNS Concepts](/using-tier0/uns-concepts/) — the namespace model these analyses run on
