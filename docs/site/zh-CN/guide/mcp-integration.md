# MCP 集成

Model Context Protocol（MCP）让 AI Agent 调用服务器暴露的工具。PiePLM 计划提供 MCP 服务器，使 Agent 无需抓取 Web UI 或持有数据库凭证，就能查询产品数据。

本页描述目标集成：工具、传输方式、权限模型和安全规则。项目处于设计阶段，发布前工具名称可能变化。

## 为什么向 Agent 开放产品数据

三个现实场景：

1. **工程助手**：“PUMP-100 从版本 A 到版本 B 改了什么，谁批准的？”
2. **质量调查**：“哪些未关闭的不符合项影响该产品的当前版本？”
3. **运营支持**：“该产品维修包包含哪些供应商零件，是否有停产件？”

每个问题都需要读取多条记录并跟踪关系。一个搜索工具加一个读取工具通常就够了；自然语言回答工具不够，因为 Agent 需要引用底层记录。

## 设计原则

- **默认只读**：除非显式启用并限定范围，否则写工具关闭。
- **与用户相同的权限**：MCP Token 继承角色和组织范围，不能绕过访问控制。
- **稳定标识**：工具返回产品编码、版本标识和记录 ID，人可以在 UI 中搜到。
- **响应有界**：每个列表工具都有默认和最大分页大小。
- **访问可审计**：MCP 读取记录 Token、操作者和查询。
- **不隐藏生成**：服务器返回记录和字段，不编造摘要。摘要由调用方 Agent 生成，并可要求其展示来源。

## 计划的只读工具

| 工具 | 用途 |
| --- | --- |
| `product_search` | 按编码、名称、描述或标签查找产品 |
| `product_get` | 读取产品身份和生命周期状态 |
| `revision_list` | 列出产品的版本 |
| `revision_get` | 读取版本快照 |
| `document_list` | 列出产品或版本的文档 |
| `bom_get` | 读取某版本的 BOM |
| `change_list` | 列出影响某产品的变更单 |
| `change_get` | 读取变更单、影响和审批 |
| `quality_list` | 列出产品或版本的不符合项 |
| `supplier_get` | 读取供应商及其零件 |
| `search` | 带过滤的跨实体搜索 |

## 计划的写工具（默认关闭）

| 工具 | 用途 | 所需范围 |
| --- | --- | --- |
| `change_draft` | 创建变更草稿 | `change:write` |
| `document_attach` | 向草稿版本附加文档 | `document:write` |
| `requirement_add` | 向草稿添加需求 | `requirement:write` |

写工具永远不能批准。批准必须由人在 Web UI 或通过具有人类身份的专用 API 完成。Agent 可以准备变更，但不能发布变更。

## 传输方式

### stdio

服务器作为 Agent 宿主的子进程运行，通过标准输入输出通信。这是本地开发机最简单的配置：Agent 启动服务器，服务器用限定范围的 Token 连接 PiePLM API。

```json
{
  "mcpServers": {
    "pieplm": {
      "command": "pieplm-mcp",
      "env": {
        "PIEPLM_API_URL": "https://plm.example.com",
        "PIEPLM_API_TOKEN": "<scoped token>"
      }
    }
  }
}
```

### HTTP

服务器为远程 Agent 暴露 HTTP 端点。这需要 TLS、Token 和网络限制。HTTP 传输面向共享基础设施，不应把产品数据暴露到公网。

## 权限模型

MCP Token 是普通 API 凭证，带有角色和范围：

- **组织**：可以读取哪个组织的数据
- **角色**：`viewer`、`engineer`、`reviewer`、`admin`
- **实体范围**：可选，限定到特定产品族或业务单元
- **工具范围**：Token 可以调用哪些工具

用于报表任务的 Token 应只允许只读工具和单一组织。发给工程助手的 Token 可以读取草稿，但不能批准。

## 审计与限流

每次工具调用记录：

- Token 标识（不是密钥）
- 操作者与组织
- 工具名称和脱敏后的参数
- 返回的记录标识
- 时间戳与耗时

限流按 Token 生效。失控的 Agent 循环应当触发限流，而不是耗尽数据库。错误以结构化 MCP 错误返回，并带重试提示。

## 安全规则

- **绝不返回密钥或内部 URL**：工具响应只包含领域数据。
- **绝不接受 SQL 或任意查询语言**：工具只接受结构化过滤条件。
- **绝不为方便而绕过权限**：UI 中受限的字段，在 MCP 中也受限。
- **不允许 Agent 批准**：批准需要人类身份和显式动作。
- **限制列表大小**：能返回十万行的工具，迟早会真的返回十万行。

## 与 PieKBS 的关系

PiePLM 存储结构化产品数据。PieKBS 存储蒸馏后的知识：流程、规范、会议记录和设计理由。Agent 可以同时使用：

- PiePLM 获取权威的产品和版本记录
- PieKBS 获取叙述性知识和原始文档

两个服务器暴露不同的工具和权限，不合并为单一索引。权威事务数据和经过整理的知识有不同生命周期和不同失败模式。

## Agent 流程示例

```text
用户：PUMP-100 的密封件从版本 A 到版本 B 改了什么？

Agent:
1. product_search({ query: "PUMP-100" })          → 产品编码 PUMP-100
2. revision_list({ product: "PUMP-100" })          → A、B
3. bom_get({ product: "PUMP-100", revision: "A" }) → SEAL-03 数量 2
4. bom_get({ product: "PUMP-100", revision: "B" }) → SEAL-03B 数量 2
5. change_list({ product: "PUMP-100" })            → CHG-2041
6. change_get({ id: "CHG-2041" })                  → 原因与审批人
7. 基于以上记录给出带引用的回答。
```

Agent 的回答质量取决于记录本身。MCP 服务器的价值在于这些记录是权威的、经过权限检查的、可引用的。

## 下一步

- [API 参考](/zh-CN/reference/api) — 底层接口
- [核心模块](/zh-CN/guide/core-modules) — 数据模型
- [配置](/zh-CN/reference/config) — MCP 设置
- [PieKBS](https://pieteams.github.io/piekbs/) — 面向 Agent 的知识库
