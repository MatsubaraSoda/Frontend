# CauseEffect

Patterns 是软件工程中不可或缺的一部分，代表着程序逻辑中潜在的可重用组件。

A user interface pattern.

```json
const people = [
  {name: "...", street: "...", city: "...", state: "...", country: "...", telephone: "...", birthday: "..."},
  .
  .
  .
  {name: "...", street: "...", city: "...", state: "...", country: "...", telephone: "...", birthday: "..."}
];
```

左侧为 a summary pane。右侧为 an adjacent pane。

## User Stories

- [x] 网页分为左右两个部分。左半部分为员工名字列表（数据方面，硬编码时不要有同名的就好。）；右半部分为员工信息卡片，考虑使用 bootstrap 的卡片组件制作。员工信息的字段见 `json` 代码。
- [x] 用户点击左侧列表的名字，右侧则显示该个人的信息。
- [x] 当右侧卡片有某员工信息时，用户点击列表另一个员工名字时，更新右侧卡片内容。

## Bonus features

- [x] 用户鼠标悬置在右侧列表的员工名字上面时，员工名字将被高亮。（考虑背景改为黄色）
- [x] 当员工名字被选中时（即右侧面板显示这个员工的信息时），高亮这个员工的姓名。
- [x] 当选择另一个员工时，上面一条所说的高亮将被取消。

## 日志

先让 AI 生成数据。
