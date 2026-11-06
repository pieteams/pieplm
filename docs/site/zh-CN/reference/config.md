# 配置说明

本页描述 PiePLM 的目标配置模型。项目处于设计阶段，名称和默认值可能在第一个版本发布前变化。但原则是稳定的：配置显式、可被环境变量覆盖、密钥不进入仓库。

## 优先级

配置按以下顺序解析，优先级从高到低：

1. 环境变量
2. 通过 `--config` 传入的配置文件
3. 内置默认值

环境变量使用 `PIEPLM_` 前缀和大写下划线命名。例如 `database.url` 对应 `PIEPLM_DATABASE_URL`。

## 最小配置

最小部署需要数据库 URL、服务端密钥和公开基础 URL：

```yaml
server:
  host: 0.0.0.0
  port: 8080
  publicUrl: https://plm.example.com

database:
  url: postgres://*************@localhost:5432/pieplm?sslmode=require
  maxOpenConnections: 20
  maxIdleConnections: 5

security:
  # 用于签名会话和短期 Token。
  # 生产环境通过 PIEPLM_SECURITY_SECRET 提供。
  secret: change-me
  sessionHours: 12
```

密钥必须使用密码学安全的随机源生成，并保存在版本控制之外的密钥管理器或环境文件中。轮换密钥会使现有会话失效，这是预期行为。

## 分区设置

### 服务器

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `server.host` | `127.0.0.1` | 绑定网卡 |
| `server.port` | `8080` | HTTP 端口 |
| `server.publicUrl` | — | 用于链接和回调的外部 URL |
| `server.trustedProxies` | 空 | 允许设置转发头的代理 |
| `server.maxBodyBytes` | `52428800` | 单请求上传上限 |

反向代理终止 TLS 时绑定 `127.0.0.1`。只在可信网络中绑定 `0.0.0.0`。

### 数据库

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `database.url` | — | PostgreSQL 连接串 |
| `database.maxOpenConnections` | `20` | 连接池上限 |
| `database.maxIdleConnections` | `5` | 保留的空闲连接 |
| `database.migrations` | `auto` | `auto`、`manual` 或 `off` |

生产环境建议使用 `manual`，让 Schema 变更经过评审后显式执行，而不是在进程启动时自动应用。

### 认证

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `auth.mode` | `local` | `local` 或 `oidc` |
| `auth.sessionHours` | `12` | 会话有效期 |
| `auth.apiKeyEnabled` | `true` | 允许集成使用 API Key |
| `auth.oidc.issuer` | — | 启用时的 OIDC 发行方 |
| `auth.oidc.clientId` | — | OIDC 客户端标识 |
| `auth.oidc.clientSecret` | — | 通过环境变量提供 |

API Key 应当限定角色和组织。发给报表工具的 Key 不应能够批准变更。

### 存储

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `storage.driver` | `local` | `local` 或 `s3` |
| `storage.local.path` | `./data/files` | 附件目录 |
| `storage.s3.endpoint` | — | S3 兼容端点 |
| `storage.s3.bucket` | — | 存储桶名称 |
| `storage.s3.region` | — | 区域 |
| `storage.s3.accessKey` | — | 优先使用环境变量或实例角色 |
| `storage.s3.secretKey` | — | 优先使用环境变量或实例角色 |

大型二进制不要存入数据库。数据库和附件卷要一起备份，保证元数据与文件一致。

### 搜索

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `search.language` | `simple` | PostgreSQL 文本检索配置 |
| `search.embeddings.enabled` | `false` | 启用可选向量通道 |
| `search.embeddings.model` | — | 嵌入模型标识 |
| `search.hybrid.weightLexical` | `0.7` | 融合中的词法权重 |
| `search.hybrid.weightVector` | `0.3` | 融合中的向量权重 |

PostgreSQL 全文检索是基线。向量搜索是可选的第二通道，应与词法结果融合，而不是替代词法搜索。见[搜索引擎](/zh-CN/guide/search-engine)。

### MCP

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `mcp.enabled` | `false` | 启用 MCP 服务器 |
| `mcp.transport` | `stdio` | `stdio` 或 `http` |
| `mcp.readOnly` | `true` | 默认禁用写工具 |
| `mcp.authToken` | — | HTTP 传输使用的 Token |

Agent 默认只读。启用写工具需要显式修改配置并使用限定范围的 Token。

### 工作流

| 键 | 默认值 | 说明 |
| --- | --- | --- |
| `workflow.requireApprovalForChanges` | `true` | 变更需要审批 |
| `workflow.requireApprovalForBom` | `true` | BOM 修改需要审批 |
| `workflow.escalationHours` | `72` | 提醒阈值 |

审批要求不应被配置到“变更作者可以自行关闭”的程度。配置工作流的权限与在流程内批准的权限必须分离。

## 环境变量覆盖

```bash
export PIEPLM_DATABASE_URL='postgres://*************@db.internal:5432/pieplm?sslmode=require'
export PIEPLM_SECURITY_SECRET="$(openssl rand -hex 32)"
export PIEPLM_SERVER_PUBLIC_URL='https://plm.example.com'
```

绝不提交真实密钥，即使是在示例文件中。提交带占位值的 `.env.example`，并为每个变量写说明。

## 校验与失败行为

配置在启动时校验。出现以下情况时进程应快速失败并给出清晰信息：

- 数据库 URL 缺失或无法连接
- 安全密钥缺失或短于最小长度
- `auth.mode=oidc` 但缺少发行方或客户端 ID
- `storage.driver=s3` 但缺少存储桶或凭证
- `mcp.transport=http` 但未配置 Token

带着无效配置启动的服务，比拒绝启动的服务更难诊断。

## 下一步

- [API 参考](/zh-CN/reference/api) — 端点与约定
- [架构设计](/zh-CN/guide/architecture) — 部署拓扑
- [安装](/zh-CN/getting-started/installation) — 部署方式
