---
layout: home

hero:
  name: "PiePLM"
  text: "面向中小制造商的产品生命周期管理"
  tagline: 一份开放、文档先行的 PLM 设计蓝图：让需求、设计、BOM 与变更保持可追溯，而不必采购重型 PLM 套件。
  actions:
    - theme: brand
      text: 阅读设计蓝图
      link: /zh-CN/getting-started/what-is-pieplm
    - theme: alt
      text: 架构设计
      link: /zh-CN/guide/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/pieteams/pieplm

features:
  - title: 范围克制
    details: 产品、版本、文档、BOM、需求、变更、质量与供应商。项目组合治理和仿真数据管理可以以后再做。
  - title: 版本感知的数据模型
    details: 产品不是一个文件名。产品、版本、零件和文档各有独立身份，并通过显式关系连接。
  - title: 受控变更
    details: 变更单记录改了什么、为什么改、影响谁、由谁批准。历史是被还原出来的，而不是靠记忆。
  - title: API 与 MCP 优先
    details: 同一份有文档的契约同时服务 Web UI、ERP 集成和 AI Agent。没有只能在界面上使用的功能。
  - title: 开源
    details: MIT 许可证。模型、迁移脚本和 API 定义都在仓库中，采用前即可审阅。
  - title: 诚实的项目状态
    details: PiePLM 目前处于文档与设计阶段。本站描述的是目标系统，不是已发布的成品。
---

## 项目状态

PiePLM 目前是一个**设计与文档项目**。公开仓库包含问题陈述、市场调研、架构笔记和模块设计，尚无可以运行的发行版本，本站也不会假装已经发布。

提前公开蓝图有两个原因：制造商可以在投入实施前评估数据模型；贡献者可以在修改成本还低的时候挑战设计。

实现里程碑会在 [GitHub 仓库](https://github.com/pieteams/pieplm) 中同步公布，文档也会随之更新。

## 用一句话描述问题

中小制造商通常用共享盘、电子表格、邮件和 ERP 来管理产品信息。图纸与 BOM 逐渐脱节，变更原因丢失，供应商记录重复，审计变成考古。传统 PLM 套件能解决这些问题，但它们的定价和实施方式面向的是拥有专职 IT 团队和漫长上线周期的大型组织。PiePLM 探索的是小团队真正能运行的那个狭窄、低负担子集。

## 设计承诺

- **唯一产品身份**：每个产品只有一条记录、一个当前版本和一个负责人。
- **显式关系**：需求、文档、BOM 行和变更通过标识符关联，而不是靠文件夹名称。
- **朴素基础设施**：Go 与 PostgreSQL，可部署在一台服务器或笔记本上。
- **数据可读**：Schema 和迁移脚本纳入版本控制，始终可以导出。
- **自动化之前先保证安全**：Agent 默认只读；写操作需要显式权限和审批路径。

## 继续阅读

- [什么是 PiePLM](/zh-CN/getting-started/what-is-pieplm) — 问题、范围与设计哲学
- [安装](/zh-CN/getting-started/installation) — 目标部署模型
- [快速入门](/zh-CN/getting-started/quick-start) — 从零到第一个产品记录
- [架构设计](/zh-CN/guide/architecture) — 分层、模块与数据流
- [PLM 系统清单](/zh-CN/getting-started/plm-systems) — 商业 PLM 市场
- [PieTeams 项目](https://pieteams.github.io/projects) — PiePLM 与 PieMDM、PieKBS 的关系
