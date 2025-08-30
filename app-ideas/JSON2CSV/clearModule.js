// 清空功能模块
// 实现 initializeClearModule 函数

/**
 * 初始化清空功能模块
 * 功能：清空 JSON 和 CSV 文本框的内容
 */
function initializeClearModule() {
    console.log('开始初始化清空模块');

    // 获取页面元素
    const clearBtn = document.getElementById('clearBtn');

    // 检查元素是否存在
    if (!clearBtn) {
        console.error('未找到清空按钮');
        return;
    }

    console.log('找到清空按钮');

    // 为清空按钮添加点击事件
    clearBtn.addEventListener('click', function() {
        console.log('点击了清空按钮');

        // 执行清空流程
        clearAllFields();
    });

    console.log('清空模块初始化完成');
}

/**
 * 执行清空所有字段的流程
 */
function clearAllFields() {
    // 1. 获取需要清空的文本框元素
    const jsonInput = document.getElementById('jsonInput');
    const csvOutput = document.getElementById('csvOutput');
    const jsonFileInput = document.getElementById('jsonFileInput');

    // 2. 检查元素是否存在
    if (!jsonInput || !csvOutput) {
        console.error('未找到需要清空的文本框元素');
        return;
    }

    // 3. 清空 JSON 文本框
    jsonInput.value = '';
    console.log('已清空 JSON 文本框');

    // 4. 清空 CSV 文本框
    csvOutput.value = '';
    console.log('已清空 CSV 文本框');

    // 5. 清空文件输入框（重置文件选择）
    if (jsonFileInput) {
        jsonFileInput.value = '';
        console.log('已重置文件选择');
    }

    // 6. 显示成功消息
    console.log('清空操作完成');
    showClearSuccessMessage('所有内容已清空！');
}

/**
 * 显示清空成功消息
 * @param {string} message - 成功消息
 */
function showClearSuccessMessage(message) {
    console.log('清空成功：', message);
    console.log(message);
}
