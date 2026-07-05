---
title: Connect
description: Collect data from PLCs, devices, and business systems into the Unified Namespace with SourceFlows. Available in all editions.
editions: [edge, cloud, enterprise]
---

**Connect** is where every Tier0 project starts: get signals out of equipment and systems, into the Unified Namespace, once. After that, every app, notebook, and agent consumes from the namespace — no more point-to-point integrations.

## What you can connect

| Category | Protocols & sources |
|---|---|
| Standard industrial | OPC UA · MQTT · Modbus |
| PLC / controller | Siemens S7 · EtherNet/IP · Omron FINS · Mitsubishi · Beckhoff ADS |
| Building / facility | BACnet and related building-side protocols |
| IT & business | REST APIs · web services · databases · CSV / batch uploads · scheduled extracts |

Typical payloads: machine states, counters, PLC tags, process values, sensor readings, device telemetry, work orders, ERP records.

## How flows work

Collection is **flow-based** (Node-RED under the hood). You assemble a **SourceFlow** from reusable nodes:

1. **Drag a source node** — the protocol, system, API, or database to read from.
2. **Transform** — filter, map, normalize, enrich, apply rules.
3. **Route and publish** — into namespace topics (and optionally dashboards or alerts).
4. **Deploy** — and reuse the same flow across lines and sites.

There are two flow types, and the naming convention matters:

| Flow type | Direction | Convention |
|---|---|---|
| **SourceFlow** | protocol → UNS topic | Named after the path it feeds: `Line1-Collector` → `Plant/Line1/…` |
| **EventFlow** | UNS topic → processing | Named after the path it subscribes to: `Line1-Processor` |

## Prepare the namespace

Topics live under typed segments — a path must contain `Metric`, `Action`, or `State`:

```bash
# create a data point with typed fields
tier0 uns create --topic Plant/Line1/Metric/Temperature --type topic \
  --fields '[{"name":"temperature","type":"float","unit":"°C"}]'

# or create a whole tree from a file
tier0 uns create --file structure.json
```

Remember the split: **paths are folders, topics are leaves.** You `browse` paths; you `read`/`write` topics. A topic's value is always an object (VQT), not a scalar:

```bash
tier0 uns write --topic Plant/Line1/Metric/Temperature \
  --value '{"temperature":27.5,"unit":"C"}'

tier0 uns read Plant/Line1/Metric/Temperature
```

## Manage flows from the CLI

```bash
tier0 flow list --source                 # list SourceFlows
tier0 flow create --name "modbus-collector" --source --desc "Modbus collection"
tier0 flow data --id 1 --out flows.json  # export canvas (backup!)
tier0 flow deploy --id 1 -f flows.json   # upload & activate a canvas
```

:::caution[Deploy replaces everything]
`flow deploy` replaces **all** node configuration on the target flow, and the CLI will ask for `--yes` confirmation. Always export a backup with `flow data` first.
:::

## Verify data is flowing

```bash
tier0 uns read "Plant/+/Metric/Temperature" --json   # wildcard across lines
tier0 uns history Plant/Line1/Metric/Temperature --start 1715000000 --end 1715600000
```

Quality (`Good` / otherwise) and fresh `timeStamp`s tell you the flow is alive.

## Next

- [Build](/using-tier0/build/) an app on the data you just connected
- [Analytics](/using-tier0/analytics/) — trend and analyze the new topics
