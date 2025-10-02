// 图片文件映射对象（键值对形式，硬编码）
let imageFiles = {
    1: 'pexels-binyaminmellish-108941.jpg',
    2: 'pexels-eberhardgross-4406342.jpg',
    3: 'pexels-eberhardgross-629160.jpg',
    4: 'pexels-erik-karits-2093459-3782463.jpg',
    5: 'pexels-gashifrheza-1486121.jpg',
    6: 'pexels-maddie-franz-727736-1571117.jpg',
    7: 'pexels-mtk402-2058853.jpg',
    8: 'pexels-orlovamaria-4946874.jpg',
    9: 'pexels-pok-rie-33563-5799946.jpg'
};

// 轮播控制变量
let currentIndex = 1;           // 当前显示的图片索引（从1开始）
let totalItems = 0;             // 总图片数量
let autoPlayInterval = null;    // 自动播放定时器
const autoPlayDelay = 3000;     // 自动播放间隔（毫秒）

// 按钮控制变量
let isTransitioning = false;    // 是否正在切换中（防重复点击）
const transitionDuration = 500; // 切换动画时长（毫秒）

// DOM 元素
const carouselList = document.querySelector('.carousel-list');

// 创建轮播项 DOM 的函数
function createCarouselItems() {
    // 清空现有内容
    carouselList.innerHTML = '';
    
    // 获取所有键值对
    const keys = Object.keys(imageFiles);
    totalItems = keys.length;
    
    // 遍历图片文件映射对象，为每张图片创建 DOM 元素
    keys.forEach((key) => {
        const imageFile = imageFiles[key];
        
        // 创建轮播项容器
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        
        // 创建图片元素
        const img = document.createElement('img');
        img.src = `./assets/img/${imageFile}`;
        img.alt = `Image ${key}`;
        img.loading = 'lazy'; // 懒加载优化
        
        // 将图片添加到轮播项中
        carouselItem.appendChild(img);
        
        // 将轮播项添加到轮播列表中
        carouselList.appendChild(carouselItem);
    });
    
    console.log(`已创建 ${totalItems} 个轮播项`);
    console.log('使用硬编码图片列表:', imageFiles);
    
    // 初始化轮播
    initCarousel();
}

// 更新轮播位置
function updateCarousel() {
    const translateX = -(currentIndex - 1) * 100;
    carouselList.style.transform = `translateX(${translateX}%)`;
}

// 下一张图片（从右到左滑动）
function nextSlide(showFeedback = false) {
    if (isTransitioning) return;  // 防重复点击
    
    isTransitioning = true;
    
    // 更新索引
    currentIndex = currentIndex === totalItems ? 1 : currentIndex + 1;
    
    // 更新轮播位置
    updateCarousel();
    
    // 只有手动交互时才显示反馈
    if (showFeedback) {
        addButtonFeedback('next');
    }
    
    // 动画完成后重置状态
    setTimeout(() => {
        isTransitioning = false;
    }, transitionDuration);
}

// 上一张图片（从左到右滑动）
function prevSlide(showFeedback = false) {
    if (isTransitioning) return;  // 防重复点击
    
    isTransitioning = true;
    
    // 更新索引
    currentIndex = currentIndex === 1 ? totalItems : currentIndex - 1;
    
    // 更新轮播位置
    updateCarousel();
    
    // 只有手动交互时才显示反馈
    if (showFeedback) {
        addButtonFeedback('prev');
    }
    
    // 动画完成后重置状态
    setTimeout(() => {
        isTransitioning = false;
    }, transitionDuration);
}

// 开始自动播放
function startAutoPlay() {
    autoPlayInterval = setInterval(() => nextSlide(false), autoPlayDelay);
}

// 停止自动播放
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 视觉反馈函数
function addButtonFeedback(direction) {
    const button = document.getElementById(`${direction}Btn`);
    button.style.opacity = '0.6';  // 点击时变暗
    
    setTimeout(() => {
        button.style.opacity = '';
    }, 200);
}

// 初始化轮播
function initCarousel() {
    // 设置初始位置
    updateCarousel();
    
    // 绑定按钮事件
    initButtonEvents();
    
    // 开始自动播放
    startAutoPlay();
    
    console.log('轮播初始化完成，开始自动播放');
}

// 初始化按钮事件
function initButtonEvents() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', () => prevSlide(true));
    nextBtn.addEventListener('click', () => nextSlide(true));
    
    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide(true);
        if (e.key === 'ArrowRight') nextSlide(true);
    });
    
    console.log('按钮事件绑定完成');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 直接创建轮播项（使用硬编码的图片列表）
    createCarouselItems();
});
