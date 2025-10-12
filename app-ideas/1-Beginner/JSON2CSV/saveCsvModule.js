// 保存 CSV 功能模块
// 实现 initializeSaveCsvModule 函数

/**
 * 初始化保存 CSV 功能模块
 * 功能：保存 CSV 数据到本地文件
 */
function initializeSaveCsvModule() {
    console.log('开始初始化保存 CSV 模块');

    // 获取页面元素
    const saveCsvBtn = document.getElementById('saveCsvBtn');

    // 检查元素是否存在
    if (!saveCsvBtn) {
        console.error('未找到保存 CSV 按钮');
        return;
    }

    console.log('找到保存 CSV 按钮');

    // 为保存按钮添加点击事件
    saveCsvBtn.addEventListener('click', function() {
        console.log('点击了保存 CSV 按钮');

        // 执行保存流程
        saveCsvToFile();
    });

    console.log('保存 CSV 模块初始化完成');
}

/**
 * 执行保存 CSV 到文件的流程
 */
function saveCsvToFile() {
    // 1. 获取 CSV 文本框的内容
    const csvOutput = document.getElementById('csvOutput');

    if (!csvOutput) {
        console.error('未找到 CSV 输出框');
        return;
    }

    const csvContent = csvOutput.value.trim();

    // 2. 检查 CSV 内容是否为空
    if (!csvContent) {
        showSaveErrorMessage('CSV 数据为空，请先转换 JSON 数据');
        return;
    }

    // 3. 创建下载链接并触发下载
    downloadCsvFile(csvContent);
}

/**
 * 创建并触发 CSV 文件下载
 * @param {string} csvContent - CSV 内容
 */
function downloadCsvFile(csvContent) {
    // 创建 Blob 对象，指定 MIME 类型为 CSV
    // Blob 是浏览器提供的用于处理二进制数据的对象
    // 第一个参数是数据数组，第二个参数是 MIME 类型
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // 创建下载链接
    // URL.createObjectURL() 创建一个指向 Blob 对象的 URL
    // 这个 URL 可以用于下载文件
    const downloadUrl = URL.createObjectURL(blob);

    // 创建隐藏的下载链接元素
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    
    // 设置下载文件名（默认为 CSV 格式）
    // 使用当前时间戳确保文件名唯一
    // 
    // 时间戳生成步骤：
    // 1. new Date().toISOString() - 获取当前时间的 ISO 格式字符串
    //    例如：'2024-01-15T10:30:45.123Z'
    // 
    // 2. .replace(/[:.]/g, '-') - 将冒号和点替换为连字符
    //    因为文件名不能包含 : 和 . 等特殊字符
    //    例如：'2024-01-15T10-30-45-123Z'
    // 
    // 3. .slice(0, 19) - 截取前19个字符，去掉毫秒部分
    //    例如：'2024-01-15T10-30-45'
    // 
    // 最终文件名格式：data_2024-01-15T10-30-45.csv
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    // 设置 download 属性
    // download 是 HTML <a> 标签的特殊属性，用于指定下载文件的名称
    // 当用户点击链接时，浏览器会使用这个名称作为下载文件的默认文件名
    // 如果不设置 download 属性，浏览器可能会使用 URL 的最后部分作为文件名
    // 例如：downloadLink.download = 'myfile.csv' 会让下载的文件名为 'myfile.csv'
    downloadLink.download = `data_${timestamp}.csv`;

    // 将链接添加到页面（隐藏）
    document.body.appendChild(downloadLink);

    // 触发点击事件，开始下载
    downloadLink.click();

    // 清理：移除链接元素和释放 URL
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);

    console.log('CSV 文件下载已触发');
    showSaveSuccessMessage('CSV 文件保存成功！');
}

/**
 * 显示保存错误消息
 * @param {string} message - 错误消息
 */
function showSaveErrorMessage(message) {
    console.error('保存错误：', message);
    console.log('错误：' + message);
}

/**
 * 显示保存成功消息
 * @param {string} message - 成功消息
 */
function showSaveSuccessMessage(message) {
    console.log('保存成功：', message);
    console.log(message);
}
