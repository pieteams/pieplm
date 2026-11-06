# API 参考

本页描述 PiePLM 的目标 API。项目处于设计阶段，端点名称和字段可能在第一个版本发布前变化。下面的约定反映实现将遵循的设计约束。

## 约定

- 基础路径：`/api/v1`
- 格式：JSON，UTF-8
- 认证：Web UI 使用会话 Cookie，API 客户端使用 Bearer Token
- 错误：RFC 9457 风格的问题详情
- 分页：游标分页，并有明确的最大页大小
- 幂等：创建操作支持 `Idempotency-Key` 请求头
- 时间：RFC 3339，UTC
- 标识：不透明字符串，不向客户端暴露自增整数

## 资源概览

| 资源 | 用途 |
| --- | --- |
| `/products` | 产品身份与生命周期状态 |
| `/products/{code}/revisions` | 版本快照 |
| `/revisions/{id}/documents` | 附件与元数据 |
| `/revisions/{id}/bom` | 结构化物料清单 |
| `/changes` | 变更单与审批 |
| `/suppliers` | 与零件关联的供应商记录 |
| `/quality/nonconformances` | 不符合项与纠正措施 |
| `/search` | 跨实体搜索 |

## 示例：创建产品

```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: 3f2c1a9e-...

{
  "code": "PUMP-100",
  "name": "冷却泵",
  "description": "用于紧凑型冷水机组的 12V 离心泵",
  "owner": "engineering.team"
}
```

响应：

```json
{
  "id": "prd_01J8Z3K4T9",
  "code": "PUMP-100",
  "name": "冷却泵",
  "lifecycleState": "development",
  "currentRevision": null,
  "createdAt": "2026-11-06T08:00:00Z"
}
```

编码是面向人的标识。即使以后修正编码，`id` 仍保持稳定。

## 示例：创建版本

```http
POST /api/v1/products/PUMP-100/revisions
{
  "revision": "A",
  "effectivity": { "type": "immediate" },
  "note": "初始设计发布"
}
```

版本一经批准即不可变。后续修改通过变更单创建新版本，不修改已批准的版本快照。

## 示例：读取 BOM

```http
GET /api/v1/products/PUMP-100/revisions/A/bom
```

```json
{
  "product": "PUMP-100",
  "revision": "A",
  "items": [
    { "line": 10, "part": "HOUSING-01", "quantity": 1, "unit": "ea" },
    { "line": 20, "part": "IMPELLER-02", "quantity": 1, "unit": "ea" },
    { "line": 30, "part": "SEAL-03", "quantity": 2, "unit": "ea" },
    { "line": 40, "part": "MOTOR-12V-04", "quantity": 1, "unit": "ea" }
  ]
}
```

BOM 行有稳定的行标识。行可以被新增、替代或删除，但不会被静默覆盖。

## 示例：提交变更

```http
POST /api/v1/changes
{
  "title": "更换密封材料",
  "product": "PUMP-100",
  "affectedRevisions": ["A"],
  "reason": "提高对冷却液添加剂的耐受性",
  "items": [
    { "action": "replace", "from": "SEAL-03", "to": "SEAL-03B", "quantity": 2 }
  ],
  "approvers": ["quality.manager", "engineering.lead"]
}
```

变更单是工作流对象。在所有必需审批完成前，它不会修改产品定义。

## 错误格式

```json
{
  "type": "https://pieteams.github.io/pieplm/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "产品 PUMP-100 已存在版本 A",
  "errors": [
    { "field": "revision", "code": "duplicate" }
  ]
}
```

客户端应基于 `type` 和 `status` 分支处理，而不是基于人类可读的 `detail`。

## 认证与授权

计划支持两种机制：

- **会话 Cookie**：用于服务端渲染的 Web UI，带 CSRF 防护
- **Bearer Token**：用于脚本、集成和 Agent

Bearer Token 限定到组织、角色，并可选限定到实体。报表工具使用的 Token 不能批准变更。每次写入都记录审计日志，包含操作者、时间和请求标识。

## 分页

```http
GET /api/v1/changes?limit=50&cursor=eyJpZCI6...
```

存在更多数据时响应包含 `nextCursor`。游标是不透明的，客户端不应自行构造。

## 限流

写端点按 Token 和组织限流，读端点限制更宽松。超过限制时返回 `429` 和 `Retry-After` 响应头。

## 版本管理

路径版本（`v1`）只在破坏性变更时改变。新增字段不改变版本。废弃字段会在发布说明中公告，并至少保留一个次版本。

## MCP 接口

MCP 服务器是同一领域模型上的另一个接口。只读工具与 API 对应：

- `product_search`
- `product_get`
- `revision_list`
- `bom_get`
- `change_list`
- `document_list`

写工具默认关闭。见 [MCP 集成](/zh-CN/guide/mcp-integration)。

## 状态

目前没有上线端点。第一个版本发布后，本页将替换为生成的 OpenAPI 规范，上面的说明会保留为约定概览。

## 下一步

- [配置](/zh-CN/reference/config) — 设置项
- [架构设计](/zh-CN/guide/architecture) — 组件设计
- [GitHub 仓库](https://github.com/pieteams/pieplm) — 实现里程碑
