# HomeLedger CT 风格界面实现计划

目标：统一现有界面并修复滚动，保持生产数据和业务行为。

架构：共享 EJS 框架 + CSS 设计规则 + 独立 workspace.js 导航交互。保持 app.js 原有业务监听，独立导航容器兼容旧侧栏逻辑。

技术栈：Express、EJS、原生 CSS/JavaScript、Node 24 本地验证。

## 任务

- [x] 修改 src/views/layout.ejs：加入完整导航抽屉、无障碍标签、桌面折叠入口、版本化 workspace.js。
- [x] 新建 src/views/partials/icon.ejs：本地静态线性图标，不加载第三方网络资源。
- [x] 新建 public/css/workspace.css（保留 app.css）：统一 tokens/排版/面板/表单，明确滚动容器，处理所有断点、长文本与深色。
- [x] 新建 public/js/workspace.js：导航状态、焦点恢复、Escape、屏幕切换清理及侧栏位置保存。只写浏览器偏好，不发送业务请求。
- [x] 隔离实例：DATA_DIR 指向 .tmp/ui-data，演示长列表/长名称；node --check 检查脚本，EJS 编译所有模板。
- [x] 浏览器验证：1707x791、390x844、低高度视口；正文滚动时品牌与顶栏不动、明细日期不遮挡、长表单底部可到达、菜单可全部访问；保存截图。
- [x] NAS 发布：读取当前相关文件与运行配置；对待替换文件逐一比对，备份原件，保留既有订阅/周期业务修正，安装界面文件后只读浏览器复核。
- [x] 提交变更和验证记录，向用户报告实际交付范围和任何未完成项。
