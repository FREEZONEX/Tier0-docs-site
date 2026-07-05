---
title: Build
description: Generate MES-class applications with the App Builder — spec first, app and namespace structure together. Available in Cloud and Enterprise.
editions: [cloud, enterprise]
---

:::note[Edge edition]
The App Builder and App Library are not part of the open-source Edge edition. On Edge you build on the namespace directly — via flows, the CLI, and your own applications. See [Choosing the Best Version](/architecture/choosing-version/#capability-matrix).
:::

**Build** is where Tier0 earns the word *agentic*: describe the application you need, and the App Builder generates an MES-class app **and its Unified Namespace structure together**. Other builders generate isolated apps; Tier0 generates connected ones — every form field, workflow state, and record has a home in the namespace from day one.

## The build loop

1. **Describe the app.** Warehouse receiving, quality inspection, maintenance requests, production reporting — plain language.
2. **Ground the context.** The AI walks you through industry, application type, and scenario, so generated logic matches how your operation actually works.
3. **Review the spec.** The builder produces a structured **`Spec.md`** — functional modules, processes, roles, permissions. Refine it in dialogue until the logic is right. *This is the step that matters: cheap to change here, expensive later.*
4. **Generate.** The app and its UNS structure are created together; preview it in a sandbox.
5. **Validate and publish.** Test, refine by dialogue if needed, then publish to **Launchpad** where authorized users can open it.

## Build by Module

For anything bigger than a single workflow, don't generate one giant app. Split it into modules inside a **Project** workspace — e.g. an MES as *receiving + quality + execution + reporting* — and generate module by module. Smaller generations are easier to test and safer to iterate.

## Start from the App Library

Often faster than describing from scratch: take a production-ready app and customize forms, fields, roles, pages, and logic.

| App | Domain |
|---|---|
| Production Dashboard | Real-time production status, output, KPIs |
| Manufacturing Execution System | Production execution and shopfloor tracking |
| Quality Checks | Standardized inspections and issue reporting |
| Warehouse Operations | Receiving, putaway, picking, packing, shipment |
| Inventory Visibility | Stock levels and movements in real time |
| Maintenance Request | Operator issue submission with traceable workflow |
| Energy Management | Plant energy and utility monitoring |
| Master Data Management | Materials, assets, locations |

All library apps sit on the same UNS — deploying three of them doesn't create three silos.

## Roles and permissions

Permissions are part of the spec, not an afterthought. A typical generated app distinguishes:

- **Field-level users** — collect data, acknowledge tasks
- **Supervisors** — review, assign, approve
- **Management** — plant KPIs, approvals, analytics

Releases are controlled: built-in permissions, approvals, and testing gate what reaches [front-line users](/using-tier0/front-line-user/).

## Where the data goes

Generated apps are namespace citizens: they consume topics for context (equipment states, orders) and **publish their outcomes back** — form submissions, workflow records, approvals. Your next app, notebook, or AI agent starts richer than the last one did. That's the compounding loop.

## Next

- [Analytics](/using-tier0/analytics/) — analyze what your apps record
- [Front-Line User](/using-tier0/front-line-user/) — what your users see in Launchpad
