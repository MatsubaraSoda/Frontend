# IOT 邮箱模拟器

**难度等级：** 1-初学者

IOT 邮箱模拟器的目标是模拟物联网（IOT）物理邮箱如何通知您"蜗牛邮件"（传统邮件）已到达。通过这样做，它将为您提供使用回调函数在不同组件之间通信状态的经验，这些组件相互依赖。

### 需求与约束

- 尽管此应用使用 JavaScript 概念和术语进行规范，但您可以选择任何语言来实现它。

- 提供以下 JavaScript 类来启动和停止监控过程，并在预设间隔内向应用网页发送邮箱门状态（开启或关闭）信号。请记住，您指定的间隔不应超过正常开门或关门所需的时间，否则您可能会错过投递！

```javascript
/**
 * 监控 IOT 蜗牛邮箱内部的光照水平，以检测邮箱门何时被打开和关闭。
 * @class IOTMailbox
 */
class IOTMailbox {
  /**
   * 创建 IOTMailbox 实例。
   * @param {number} [signalInterval=500] 检查邮箱状态的定时器间隔。
   * @param {function} signalCallback 定时器间隔到期时要调用的函数。
   * @memberof IOTMailbox
   */
  constructor(signalInterval = 500, signalCallback) {
    this.signalInterval = signalInterval;
    this.signalCallback = signalCallback;
    this.intervalID = null;
    this.lastLightLevel = 0;
  }

  /**
   * 开始监控邮箱，并在间隔到期时调用调用者指定的回调函数。
   * @memberof IOTMailbox
   */
  startMonitoring = () => {
    console.log(`开始监控邮箱...`);
    this.intervalID = window.setInterval(this.signalStateChange, this.signalInterval);
  }

  /**
   * 停止监控邮箱状态
   * @memberof IOTMailbox
   */
  stopMonitoring = () => {
    if (this.intervalID === null) return;
    window.clearInterval(this.intervalID);
    this.intervalID = null;
    console.log(`邮箱监控已停止...`);
  }

  /**
   * 将邮箱内的当前光照水平传递给用户的回调函数。正光照水平表示门是打开的，
   * 而负光照水平表示门是关闭的。根据采样间隔，邮箱门可能处于从完全关闭到完全打开的任何位置。
   * 这意味着光照水平在间隔之间会发生变化。
   * @memberof IOTMailbox
   */
  signalStateChange = () => {
    const lightLevel = this.lastLightLevel >= 0 
      ? Math.random().toFixed(2) * -1 
      : Math.random().toFixed(2);
    console.log(`邮箱状态已更改 - 光照水平: ${lightLevel}`);
    this.signalCallback(lightLevel);
    this.lastLightLevel = lightLevel;
  }
};
```

## 用户故事

-   [ ] 用户可以看到一个包含控制面板的网页，控制面板包含三个按钮 - '开始监控'、'停止监控' 和 '重置'。
-   [ ] 用户可以看到一个通知面板，邮箱状态将在此处发布。
-   [ ] 用户可以看到一个可滚动的日志面板，描述应用操作和与 IOTMailbox 实例接口的执行详细信息将在此处发布。
-   [ ] 用户可以点击 '开始监控' 按钮开始接收来自邮箱的状态通知。
-   [ ] 用户可以在监控开始时看到添加到日志面板的消息。
-   [ ] 用户可以看到通过回调函数传递的光照水平添加到日志面板的消息。这应该包括数值光照水平以及门是打开还是关闭。
-   [ ] 用户可以在门被打开时看到添加到通知面板的消息。
-   [ ] 用户可以点击 '停止监控' 按钮停止接收来自邮箱的状态通知。
-   [ ] 用户可以在监控停止时看到添加到日志面板的消息。

## 奖励功能

-   [ ] 用户可以看到 '开始监控' 按钮在监控停止之前被禁用。
-   [ ] 用户可以看到 '停止监控' 按钮在监控开始之前被禁用。
-   [ ] 用户可以在控制面板中看到一个字段，允许指定监控间隔的长度。
-   [ ] 如果门保持打开状态，用户可以看到添加到通知面板的消息。
-   [ ] 当门被打开时，用户可以听到声音警报。

## 有用的链接和资源

- [蜗牛邮件 (Wikipedia)](https://en.wikipedia.org/wiki/Snail_mail)
- [物联网 (Wikipedia)](https://en.wikipedia.org/wiki/Internet_of_things)
- [IOT 邮箱：介绍](https://iotexpert.com/2018/08/13/iot-mailbox-an-introduction/)
- [回调函数到底是什么？](https://codeburst.io/javascript-what-the-heck-is-a-callback-aba4da2deced)
- [window.setInterval (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval)

## 示例项目

暂无
