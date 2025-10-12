# FlipImage App 开发笔记

## CSS Transform 翻转效果

### 图片翻转方向对照表

| 翻转方向 | CSS Transform | 说明 |
|---------|---------------|------|
| 向右翻转 | `transform: rotateY(180deg);` | 绕Y轴顺时针旋转180度 |
| 向左翻转 | `transform: rotateY(-180deg);` | 绕Y轴逆时针旋转180度 |
| 向上翻转 | `transform: rotateX(180deg);` | 绕X轴顺时针旋转180度 |
| 向下翻转 | `transform: rotateX(-180deg);` | 绕X轴逆时针旋转180度 |

### 使用示例

```css
/* 向右翻转 */
.flip-right {
    transform: rotateY(180deg);
}

/* 向左翻转 */
.flip-left {
    transform: rotateY(-180deg);
}

/* 向上翻转 */
.flip-up {
    transform: rotateX(180deg);
}

/* 向下翻转 */
.flip-down {
    transform: rotateX(-180deg);
}
```

### JavaScript 应用示例

```javascript
// 根据按钮方向应用翻转效果
function flipImage(direction) {
    const image = document.querySelector('.image');
    
    switch(direction) {
        case 'right':
            image.style.transform = 'rotateY(180deg)';
            break;
        case 'left':
            image.style.transform = 'rotateY(-180deg)';
            break;
        case 'up':
            image.style.transform = 'rotateX(180deg)';
            break;
        case 'down':
            image.style.transform = 'rotateX(-180deg)';
            break;
    }
}
```

### 注意事项

- 正数表示顺时针旋转
- 负数表示逆时针旋转
- 可以添加 `transition` 属性实现平滑动画效果
- 翻转后图片会显示镜像效果

---

*创建时间：2024年*
*用途：FlipImage App 开发参考*
