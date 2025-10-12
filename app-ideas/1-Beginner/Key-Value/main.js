// 全局 DOM 元素变量
let displayPanel;
let indicatorPanel;
let indicatorList;
let displayTextarea;
let indicators = {};
let audio;


document.addEventListener('DOMContentLoaded', () => {

    console.log("页面加载完成");
    
    // 初始化所有 DOM 元素
    displayPanel = document.getElementById('displayPanel');
    indicatorPanel = document.getElementById('indicatorPanel');
    indicatorList = document.getElementById('indicatorList');
    displayTextarea = document.getElementById('displayTextarea');
    
    // 初始化修饰键指示器元素
    indicators = {
        alt: document.querySelector('[data-key="alt"]'),
        ctrl: document.querySelector('[data-key="ctrl"]'),
        meta: document.querySelector('[data-key="meta"]'),
        shift: document.querySelector('[data-key="shift"]')
    };
    
    // 初始化音频对象
    audio = new Audio('./assets/ui-sound-2-374229.mp3');
    
    setupKeyboardListeners();

});

function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        console.log(e.key, e.code);
        // 播放音频
        playAudio();

        // 显示信息
        displayInfo(e.key, e.code);

        // 更新修饰键状态
        updateModifierKeys(e);

        // 阻止默认行为
        e.preventDefault();
    });

    // 监听按键释放事件
    document.addEventListener('keyup', (e) => {
        // 更新修饰键状态
        updateModifierKeys(e);
        
        // 阻止默认行为
        e.preventDefault();
    });
}

function playAudio() {
    // 重置音频到开始位置
    audio.currentTime = 0;
    // 播放音效，忽略错误
    audio.play().catch(error => {
        console.log('音效播放失败:', error);
    });
}

function displayInfo(key, code) {
    displayTextarea.innerText = `您按下了 "${key}" 键，其 W3C 标准编码为 ${code}`;
    
    // 触发闪烁动画
    flashDisplayArea();
}

function flashDisplayArea() {
    // 如果动画正在播放，直接返回
    if (displayTextarea.classList.contains('flash')) {
        return;
    }
    
    // 添加动画类
    displayTextarea.classList.add('flash');
    
    // 动画结束后移除类
    setTimeout(() => {
        displayTextarea.classList.remove('flash');
    }, 600); // 与动画持续时间一致
}

function updateModifierKeys(event) {
    // 修饰键映射表
    // 注意：event['altKey'] 与 event.altKey 完全等价
    // 使用方括号语法是为了动态访问属性名
    const modifierKeys = [
        { key: 'altKey', element: indicators.alt },
        { key: 'ctrlKey', element: indicators.ctrl },
        { key: 'metaKey', element: indicators.meta },
        { key: 'shiftKey', element: indicators.shift }
    ];

    // 批量更新修饰键状态
    // event[key] 等价于 event.altKey, event.ctrlKey 等
    modifierKeys.forEach(({ key, element }) => {
        if (event[key]) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}
