# 需求文档

提供两个文本框，一个放 json 一个放 csv。

中间有两个转化按钮，一个 json to csv，另一个 csv to json。

在各自的文本框上提供：

- 从本地导入
- 导出到本地
- 清空文本

底部提供一个 log 日志，这部分采用终端风格设计。

使用原生 html css js。

sytle 设计全权交给 ai 负责。开发者负责 class 和 id 的命名规范，html 的格局设计，js 的模块设计。

html:
container -> jsonPanel + convertPanel + csvPanel + logPanel
jsonPanel, csvPanel -> control + text
converPanel -> jsonToCsv + csvToJson
logPanel -> timeStamp + message

js:
mian.js // 入口
ui-manager.js // 管理 DOM
handler.js // 执行各类事务
utils.js // 工具类

ui-manager.js

负责管理所有的事件监听。监听到事件后，调用相应的 handle。

原则上，utiles 只供 handler 使用。