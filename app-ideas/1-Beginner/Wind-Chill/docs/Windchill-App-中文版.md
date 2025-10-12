# 风寒指数

**难度等级：** 1-初学者

风寒指数将实际温度与风速结合起来计算风寒因子，也就是计算感知温度相对于实际温度的值。

## 用户故事

-   [ ] 用户可以选择计算将使用的测量系统 - 公制或英制
-   [ ] 用户可以输入实际温度和风速
-   [ ] 用户可以点击 `计算` 按钮来显示风寒指数
-   [ ] 如果未输入数据值就点击 `计算`，用户将收到错误消息

## 额外功能

-   [ ] 如果计算得出的风寒因子大于或等于实际温度，用户点击 `计算` 时将收到错误消息。由于这表示计算内部错误，你也可以使用断言来满足此要求
-   [ ] 如果用户在没有先更改至少一个输入字段的情况下点击 `计算`，将提示用户输入新的数据值
-   [ ] 每当输入新的实际温度或风速值时，用户将看到更新的风寒因子，而无需点击 `计算` 按钮

## 有用的链接和资源

-   [维基百科 风寒](https://en.wikipedia.org/wiki/Wind_chill)
-   [JavaScript 断言](https://developer.mozilla.org/en-US/docs/Web/API/console/assert)

## 示例项目

[风寒计算器](http://www.jsmadeeasy.com/javascripts/Calculators/Wind%20Chill%20Calculator/index.htm)
[Svelte 风寒指数 by Gabriele Corti](https://codepen.io/borntofrappe/pen/WNNrrJg)

