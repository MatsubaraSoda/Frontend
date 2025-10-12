# GitHub 状态

**级别：** 1-初学者

Web 应用程序通过多种方式获取数据。通过网页中的用户输入、通过 API 到后端系统、从文件和数据库，有时通过"抓取"网站。GitHub 状态应用程序的目标是向您介绍从另一个网站抓取信息的一种方法。

GitHub 状态使用 NPM Request 包从 [GitHub 状态](https://www.githubstatus.com/) 网站检索当前 GitHub 站点状态。Request 包允许将网站检索到不是浏览器窗口，而是作为可以轻松被您的代码访问的 JSON 文档。

虽然此应用程序规范严重依赖 Javascript，但请随意使用您选择的语言来开发它！

## 用户故事

-   [ ] 用户可以在主应用程序窗口中看到 GitHub Git 操作、API 请求、操作问题、PR、仪表板和项目、操作通知、操作 Gists 和操作 GitHub Pages 的当前状态列表。
-   [ ] 用户可以通过点击"获取状态"按钮从 GitHub 状态网站检索最新状态。

## 奖励功能

-   [ ] 用户可以看到任何不在"操作"状态的 GitHub 组件通过不同的颜色、背景动画或任何其他技术突出显示。发挥您的想象力！

## 有用的链接和资源

- [Web 抓取 (Wikipedia)](https://en.wikipedia.org/wiki/Web_scraping)
- [NPM Request](https://www.npmjs.com/package/request)
- [Javascript JSON (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [Javascript 对象表示法](https://json.org/)
- 提示！您可以使用以下代码从命令行命令 `node ghstatus` 显示 GitHub 状态网站页面的 JSON。您可以使用此输出来确定哪些 JSON 元素包含开发此应用程序所需的状态信息。
```
ghstatus.js

const request = require('request');
request('https://www.githubstatus.com/',  { json: true }, (err, res, body) => {  
    console.log(body);
});
```

## 示例项目

- [Peter Luczynski 的示例](https://peterluczynski.github.io/github-status/)
- [Diogo Moreira 的示例](https://diogomoreira.github.io/github-status/)
