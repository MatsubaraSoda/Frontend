import { Utility } from "./utility.js";

// EventManager 类
class EventManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.setupEventListeners();
  }

  // 设置事件监听器
  setupEventListeners() {
    // 监听urlInput输入
    this.uiManager.urlInput.addEventListener("input", (e) => {
      this.handleUrlInput(e);
    });

    // 监听按钮事件
    this.uiManager.displayBtn.addEventListener("click", (e) => {
      this.handleDisplayBtn(e);
    });

    // 监听翻转按钮点击
    this.uiManager.flipButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleFlipButton(e);
      });
    });
  }

  // 处理urlInput输入
  handleUrlInput(e) {
    if (e.type === "input") {
      console.log("e.type =", e.type);
      console.log("e.target =", e.target);
      console.log("e.target.value =", e.target.value);
    }
  }

  // 处理翻转按钮点击
  handleFlipButton(e) {
    const direction = e.target.getAttribute("data-direction");
    const flipInner = e.target
      .closest(".image-cell")
      .querySelector(".flip-inner");
    const image = e.target.closest(".image-cell").querySelector(".image");

    // 获取CSS transition时间
    const transitionDuration = Utility.getTransitionDuration(flipInner);

    switch (direction) {
      case "up":
        console.log("向上翻转 ↑");
        if (flipInner.style.transform === "") {
          flipInner.style.transform = "rotateX(180deg)";
        } else {
          flipInner.style.transform = "";
          setTimeout(() => {
            flipInner.style.transform = "rotateX(180deg)";
          }, transitionDuration);
        }
        break;
      case "down":
        console.log("向下翻转 ↓");
        if (flipInner.style.transform === "") {
          flipInner.style.transform = "rotateX(-180deg)";
        } else {
          flipInner.style.transform = "";
          setTimeout(() => {
            flipInner.style.transform = "rotateX(-180deg)";
          }, transitionDuration);
        }
        break;
      case "left":
        console.log("向左翻转 ←");
        if (flipInner.style.transform === "") {
          flipInner.style.transform = "rotateY(-180deg)";
        } else {
          flipInner.style.transform = "";
          setTimeout(() => {
            flipInner.style.transform = "rotateY(-180deg)";
          }, transitionDuration);
        }
        break;
      case "right":
        console.log("向右翻转 →");
        if (flipInner.style.transform === "") {
          flipInner.style.transform = "rotateY(180deg)";
        } else {
          flipInner.style.transform = "";
          setTimeout(() => {
            flipInner.style.transform = "rotateY(180deg)";
          }, transitionDuration);
        }
        break;
      case "reset":
        console.log("重置图片 ↻");
        flipInner.style.transform = "";
        break;
      default:
        return;
    }
  }

  // 处理加载图片按钮
  async handleDisplayBtn(e) {
    if (e.type === "click") {
      // 获取 url
      const imageUrl = this.uiManager.urlInput.value;

      // 使用工具函数加载图片
      try {
        await Utility.loadImageWithTimeout(imageUrl);
        console.log("图片加载成功:", imageUrl);
        this.uiManager.hideError();

        // 图片加载成功，更新所有图片的src
        const allImages = document.querySelectorAll(".image");
        allImages.forEach((image) => {
          image.src = imageUrl;
        });
        console.log("已更新所有图片src为:", imageUrl);
      } catch (error) {
        console.error("图片加载失败:", error.message);
        this.uiManager.showError(error.message);
      }
    }
  }
}

// 导出类
export { EventManager };
