# 食谱应用

**难度等级：** 1-初学者

您可能没有意识到这一点，但食谱无非就是烹饪算法。就像程序一样，食谱是一系列命令式步骤，如果正确遵循，就会产生美味的菜肴。

食谱应用的目标是帮助用户以易于遵循的方式管理食谱。

### 约束条件

- 对于此应用的初始版本，食谱数据可以编码为JSON文件。在实现此应用的初始版本后，您可以扩展此功能以在文件或数据库中维护食谱。

## 用户故事

-   [ ] 用户可以看到食谱标题列表
-   [ ] 用户可以点击食谱标题来显示食谱卡片，包含食谱标题、餐食类型（早餐、午餐、晚餐或小食）、供应人数、难度等级（初学者、中级、高级）、配料清单（包括用量）和制作步骤。
-   [ ] 用户点击新的食谱标题时，用新食谱替换当前卡片。

## 奖励功能

-   [ ] 用户可以看到一张照片，显示食物制作完成后的样子。
-   [ ] 用户可以通过在搜索框中输入菜名并点击"搜索"按钮来搜索不在食谱标题列表中的食谱。可以使用任何开源食谱API作为食谱来源（参见下面的The MealDB）。
-   [ ] 用户可以看到与搜索条件匹配的食谱列表
-   [ ] 用户可以点击食谱名称来显示其食谱卡片。
-   [ ] 如果没有找到匹配的食谱，用户可以看到警告消息。
-   [ ] 用户可以点击通过API找到的食谱卡片上的"保存"按钮，将副本保存到此应用的食谱文件或数据库中。

## 有用的链接和资源

- [使用Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Axios](https://www.npmjs.com/package/axios)
- [The MealDB API](https://www.themealdb.com/api.php) 

## 示例项目

- [Recipe Box - a Free Code Camp Project (FCC)](https://codepen.io/eddyerburgh/pen/xVeJvB)
- [React Recipe Box](https://codepen.io/inkblotty/pen/oxWRme)
