# GitHub Status API 接口说明

## 概述

GitHub Status 使用 Statuspage.io 服务提供状态监控，通过 RESTful API 可以获取 GitHub 各项服务的实时状态信息。所有 API 接口都无需认证，直接返回 JSON 格式数据。

## 基础信息

- **基础URL**: `https://www.githubstatus.com/api/v2/`
- **数据格式**: JSON
- **认证要求**: 无需认证
- **请求限制**: 无明确限制，建议合理使用

## 主要 API 接口

### 1. 状态摘要 (Summary)

**接口地址**: `https://www.githubstatus.com/api/v2/summary.json`

**功能**: 获取状态页面的完整摘要信息，包括所有组件的状态、未解决的事件和计划维护。

**返回数据包含**:
- `page`: 页面基本信息
- `status`: 整体状态指示器
- `components`: 所有服务组件的状态列表
- `incidents`: 未解决的事件
- `scheduled_maintenances`: 计划维护

**使用场景**: 推荐用于获取完整的状态信息，适合大多数应用场景。

### 2. 整体状态 (Status)

**接口地址**: `https://www.githubstatus.com/api/v2/status.json`

**功能**: 获取整个页面的状态汇总，包括整体状态指示器和描述。

**返回数据包含**:
- `page`: 页面基本信息
- `status`: 整体状态信息
  - `indicator`: 状态指示器 (none, minor, major, critical)
  - `description`: 状态描述

**使用场景**: 适合只需要了解整体状态，不需要详细组件信息的场景。

### 3. 计划维护 (Scheduled Maintenances)

**接口地址**: `https://www.githubstatus.com/api/v2/scheduled-maintenances.json`

**功能**: 获取所有计划维护的信息。

**返回数据包含**:
- `page`: 页面基本信息
- `scheduled_maintenances`: 计划维护列表

**使用场景**: 适合需要了解即将进行的维护活动的场景。

## 状态指示器说明

### 整体状态指示器 (Status Indicator)

| 值 | 含义 | 描述 |
|---|---|---|
| `none` | 正常 | 所有系统正常运行 |
| `minor` | 轻微问题 | 部分系统性能下降 |
| `major` | 主要问题 | 部分系统中断 |
| `critical` | 严重问题 | 主要服务中断 |

### 组件状态 (Component Status)

| 值 | 含义 | 描述 |
|---|---|---|
| `operational` | 正常运行 | 服务完全正常 |
| `degraded_performance` | 性能下降 | 服务可用但性能降低 |
| `partial_outage` | 部分中断 | 部分功能不可用 |
| `major_outage` | 主要中断 | 服务基本不可用 |
| `under_maintenance` | 维护中 | 计划维护进行中 |

## 示例请求

### 获取状态摘要

```bash
curl "https://www.githubstatus.com/api/v2/summary.json"
```

### 使用 JavaScript fetch

```javascript
fetch('https://www.githubstatus.com/api/v2/summary.json')
  .then(response => response.json())
  .then(data => {
    console.log('整体状态:', data.status);
    console.log('组件状态:', data.components);
  })
  .catch(error => {
    console.error('获取状态失败:', error);
  });
```

## 返回数据示例

### Summary API 返回结构

```json
{
  "page": {
    "id": "kctbh9vrtdwd",
    "name": "GitHub",
    "url": "https://www.githubstatus.com",
    "time_zone": "Etc/UTC",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "status": {
    "indicator": "none",
    "description": "All Systems Operational"
  },
  "components": [
    {
      "id": "8l4ygp8dwjlt",
      "name": "Git Operations",
      "status": "operational",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "position": 1,
      "description": null,
      "showcase": true,
      "start_date": null,
      "group_id": null,
      "page_id": "kctbh9vrtdwd",
      "group": false,
      "only_show_if_degraded": false
    }
  ],
  "incidents": [],
  "scheduled_maintenances": []
}
```

## 监控的服务组件

GitHub Status 监控以下主要服务：

1. **Git Operations** - Git 操作
2. **API Requests** - API 请求
3. **Issues** - 问题追踪
4. **Pull Requests** - 拉取请求
5. **Actions** - GitHub Actions
6. **Packages** - 包管理
7. **Pages** - GitHub Pages
8. **Codespaces** - 代码空间
9. **Copilot** - GitHub Copilot

## 使用建议

### 1. 缓存策略
- 建议缓存 API 响应 1-2 分钟
- 避免过于频繁的请求

### 2. 错误处理
- 实现适当的错误处理和重试机制
- 考虑网络超时情况

### 3. 数据解析
- 重点关注 `components` 数组中的状态信息
- 根据 `status` 字段判断服务状态

### 4. 用户体验
- 为不同状态提供视觉区分
- 显示最后更新时间
- 提供手动刷新功能

## 相关资源

- [GitHub Status 官网](https://www.githubstatus.com/)
- [Statuspage.io API 文档](https://developer.statuspage.io/)
- [GitHub Status API 文档](https://www.githubstatus.com/api/)

## 注意事项

1. **跨域问题**: 在浏览器中直接调用可能遇到 CORS 限制
2. **数据更新**: 状态数据通常每 1-2 分钟更新一次
3. **服务可用性**: API 本身也可能出现不可用的情况
4. **数据格式**: 返回的 JSON 结构可能随时间变化

---

*最后更新: 2024年1月*
