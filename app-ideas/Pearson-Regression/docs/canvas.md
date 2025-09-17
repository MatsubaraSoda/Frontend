# Canvas 教程 - 前端新手指南

## 1. Canvas 是什么？

### 1.1 基本概念

`<canvas>` 是HTML5提供的一个**画布元素**，它允许你使用JavaScript在网页上绘制图形、动画和图像。

**简单理解：**
- Canvas = 一张空白的画布
- JavaScript = 你的画笔
- 你可以在画布上画任何东西！

### 1.2 Canvas vs 其他绘图方式

| 方式 | 特点 | 适用场景 |
|------|------|----------|
| **Canvas** | 像素级控制、高性能 | 游戏、图表、动画 |
| **SVG** | 矢量图形、可缩放 | 图标、简单图形 |
| **CSS** | 样式装饰 | 布局、简单效果 |
| **图片** | 静态内容 | 照片、固定图形 |

### 1.3 为什么选择Canvas？

✅ **完全控制** - 可以控制每一个像素  
✅ **高性能** - 硬件加速，适合动画  
✅ **无依赖** - 浏览器原生支持  
✅ **灵活性** - 可以画任何复杂的图形  

## 2. 基础用法

### 2.1 HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Canvas 基础</title>
</head>
<body>
    <!-- 创建画布 -->
    <canvas id="myCanvas" width="400" height="300"></canvas>
    
    <script>
        // JavaScript 代码写在这里
    </script>
</body>
</html>
```

**重要属性：**
- `id` - 给画布起个名字
- `width` - 画布宽度（像素）
- `height` - 画布高度（像素）

### 2.2 获取画布上下文

```javascript
// 获取画布元素
const canvas = document.getElementById('myCanvas');

// 获取2D绘图上下文（这是你的"画笔"）
const ctx = canvas.getContext('2d');
```

**解释：**
- `canvas` = 画布本身
- `ctx` = 绘图工具（画笔、颜料等）

## 3. 基础绘图

### 3.1 绘制矩形

```javascript
// 获取画布和上下文
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 设置填充颜色
ctx.fillStyle = 'red';

// 绘制填充矩形 (x, y, width, height)
ctx.fillRect(50, 50, 100, 80);

// 设置边框颜色
ctx.strokeStyle = 'blue';
ctx.lineWidth = 3;

// 绘制边框矩形
ctx.strokeRect(200, 50, 100, 80);
```

**参数说明：**
- `x, y` - 矩形左上角坐标
- `width, height` - 矩形的宽度和高度

### 3.2 绘制圆形

```javascript
// 开始绘制路径
ctx.beginPath();

// 绘制圆形 (x, y, radius, startAngle, endAngle)
ctx.arc(100, 100, 50, 0, 2 * Math.PI);

// 设置填充颜色
ctx.fillStyle = 'green';
ctx.fill();

// 设置边框
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.stroke();
```

**参数说明：**
- `x, y` - 圆心坐标
- `radius` - 半径
- `startAngle, endAngle` - 起始角度和结束角度（弧度）

### 3.3 绘制线条

```javascript
// 开始新路径
ctx.beginPath();

// 移动到起始点
ctx.moveTo(50, 50);

// 画线到终点
ctx.lineTo(200, 100);

// 设置线条样式
ctx.strokeStyle = 'purple';
ctx.lineWidth = 5;

// 绘制线条
ctx.stroke();
```

### 3.4 绘制文字

```javascript
// 设置文字样式
ctx.font = '24px Arial';
ctx.fillStyle = 'blue';
ctx.textAlign = 'center';

// 绘制填充文字
ctx.fillText('Hello Canvas!', 200, 150);

// 绘制边框文字
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.strokeText('Hello Canvas!', 200, 200);
```

## 4. 颜色和样式

### 4.1 颜色设置

```javascript
// 使用颜色名称
ctx.fillStyle = 'red';
ctx.fillStyle = 'blue';
ctx.fillStyle = 'green';

// 使用十六进制颜色
ctx.fillStyle = '#FF0000';  // 红色
ctx.fillStyle = '#00FF00';  // 绿色
ctx.fillStyle = '#0000FF';  // 蓝色

// 使用RGB颜色
ctx.fillStyle = 'rgb(255, 0, 0)';    // 红色
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // 半透明红色

// 使用HSL颜色
ctx.fillStyle = 'hsl(120, 100%, 50%)'; // 绿色
```

### 4.2 渐变效果

```javascript
// 创建线性渐变
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, 'red');
gradient.addColorStop(0.5, 'yellow');
gradient.addColorStop(1, 'blue');

// 使用渐变
ctx.fillStyle = gradient;
ctx.fillRect(50, 50, 200, 100);

// 创建径向渐变
const radialGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 50);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');

ctx.fillStyle = radialGradient;
ctx.fillRect(50, 200, 200, 100);
```

### 4.3 线条样式

```javascript
// 线条宽度
ctx.lineWidth = 5;

// 线条端点样式
ctx.lineCap = 'round';    // 圆形端点
ctx.lineCap = 'square';   // 方形端点
ctx.lineCap = 'butt';     // 平直端点

// 线条连接样式
ctx.lineJoin = 'round';   // 圆形连接
ctx.lineJoin = 'bevel';   // 斜角连接
ctx.lineJoin = 'miter';   // 尖角连接

// 虚线样式
ctx.setLineDash([10, 5]); // 10像素实线，5像素空白
ctx.stroke();
```

## 5. 动画基础

### 5.1 简单动画

```javascript
let x = 0; // 球的x坐标

function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制球
    ctx.beginPath();
    ctx.arc(x, 100, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    
    // 移动球
    x += 2;
    
    // 如果球超出边界，重新开始
    if (x > canvas.width) {
        x = 0;
    }
    
    // 继续动画
    requestAnimationFrame(animate);
}

// 开始动画
animate();
```

### 5.2 交互动画

```javascript
let mouseX = 0;
let mouseY = 0;

// 监听鼠标移动
canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制跟随鼠标的圆
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    
    requestAnimationFrame(animate);
}

animate();
```

## 6. 实用技巧

### 6.1 保存和恢复状态

```javascript
// 保存当前状态
ctx.save();

// 做一些变换
ctx.translate(100, 100);
ctx.rotate(Math.PI / 4);
ctx.scale(2, 2);

// 绘制图形
ctx.fillRect(0, 0, 50, 50);

// 恢复之前的状态
ctx.restore();

// 现在可以正常绘制了
ctx.fillRect(0, 0, 50, 50);
```

### 6.2 变换操作

```javascript
// 平移
ctx.translate(100, 100);

// 旋转（角度用弧度）
ctx.rotate(Math.PI / 4); // 旋转45度

// 缩放
ctx.scale(2, 2); // 放大2倍

// 绘制图形
ctx.fillRect(0, 0, 50, 50);
```

### 6.3 图像处理

```javascript
// 创建图像对象
const img = new Image();

// 图像加载完成后绘制
img.onload = function() {
    // 绘制图像
    ctx.drawImage(img, 0, 0);
    
    // 缩放绘制
    ctx.drawImage(img, 0, 0, 100, 100);
    
    // 裁剪绘制
    ctx.drawImage(img, 10, 10, 50, 50, 0, 0, 100, 100);
};

// 设置图像源
img.src = 'image.jpg';
```

## 7. 常见问题解决

### 7.1 画布模糊问题

```javascript
// 获取设备像素比
const dpr = window.devicePixelRatio || 1;

// 设置画布实际大小
canvas.width = 400 * dpr;
canvas.height = 300 * dpr;

// 设置画布显示大小
canvas.style.width = '400px';
canvas.style.height = '300px';

// 缩放上下文
ctx.scale(dpr, dpr);
```

### 7.2 性能优化

```javascript
// 1. 减少不必要的重绘
// 只重绘变化的部分
ctx.clearRect(x, y, width, height);

// 2. 使用离屏画布
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

// 在离屏画布上绘制复杂图形
offscreenCtx.fillRect(0, 0, 100, 100);

// 将离屏画布内容复制到主画布
ctx.drawImage(offscreenCanvas, 0, 0);

// 3. 避免频繁的状态改变
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 50, 50);
ctx.fillRect(100, 0, 50, 50); // 复用相同的fillStyle
```

## 8. 完整示例

### 8.1 简单的绘图应用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Canvas 绘图应用</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        canvas { border: 1px solid #ccc; cursor: crosshair; }
        .controls { margin: 10px 0; }
        button { margin: 5px; padding: 10px; }
    </style>
</head>
<body>
    <h1>Canvas 绘图应用</h1>
    
    <div class="controls">
        <button onclick="clearCanvas()">清除</button>
        <button onclick="changeColor('red')">红色</button>
        <button onclick="changeColor('blue')">蓝色</button>
        <button onclick="changeColor('green')">绿色</button>
    </div>
    
    <canvas id="myCanvas" width="600" height="400"></canvas>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        let isDrawing = false;
        let currentColor = 'black';
        
        // 开始绘制
        canvas.addEventListener('mousedown', function(e) {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });
        
        // 绘制中
        canvas.addEventListener('mousemove', function(e) {
            if (isDrawing) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        });
        
        // 结束绘制
        canvas.addEventListener('mouseup', function() {
            isDrawing = false;
        });
        
        // 清除画布
        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // 改变颜色
        function changeColor(color) {
            currentColor = color;
        }
    </script>
</body>
</html>
```

## 9. 学习建议

### 9.1 学习路径

1. **基础阶段**
   - 掌握基本图形绘制
   - 理解坐标系统
   - 学会使用颜色和样式

2. **进阶阶段**
   - 学习动画原理
   - 掌握变换操作
   - 理解事件处理

3. **高级阶段**
   - 性能优化技巧
   - 复杂图形算法
   - 游戏开发应用

### 9.2 实践建议

- ✅ **多动手练习** - 每个例子都要亲自敲一遍
- ✅ **从简单开始** - 先画基本图形，再画复杂图案
- ✅ **理解原理** - 不要只是复制代码，要理解为什么
- ✅ **多做项目** - 用Canvas做实际的小项目

### 9.3 常用资源

- **MDN Canvas文档** - 最权威的参考
- **Canvas API参考** - 详细的API说明
- **在线编辑器** - CodePen、JSFiddle等
- **示例代码** - GitHub上的开源项目

## 10. 总结

Canvas是一个强大的绘图工具，它让你可以：

- 🎨 **绘制任何图形** - 从简单线条到复杂图案
- 🎬 **创建动画** - 流畅的动画效果
- 🎮 **开发游戏** - 2D游戏开发
- 📊 **数据可视化** - 图表和统计图
- 🖼️ **图像处理** - 滤镜和特效

**记住：**
- Canvas = 画布 + JavaScript画笔
- 从简单开始，逐步学习
- 多练习，多实践
- 理解原理比记住代码更重要

现在你已经掌握了Canvas的基础知识，可以开始你的绘图之旅了！🚀
