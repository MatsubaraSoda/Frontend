// 上传 JSON 功能模块
// 实现 initializeUploadJsonModule 函数

/**
 * 初始化上传 JSON 功能模块
 * 功能：处理 JSON 文件上传
 */
function initializeUploadJsonModule() {
    console.log('开始初始化上传 JSON 模块');
    
    // 获取页面元素
    const uploadJsonBtn = document.getElementById('uploadJsonBtn');
    const jsonFileInput = document.getElementById('jsonFileInput');
    
    // 检查元素是否存在
    if (!uploadJsonBtn) {
        console.error('未找到上传 JSON 按钮');
        return;
    }
    
    if (!jsonFileInput) {
        console.error('未找到文件输入元素');
        return;
    }
    
    console.log('找到上传按钮和文件输入元素');
    
    // 为上传按钮添加点击事件
    uploadJsonBtn.addEventListener('click', function() {
        console.log('点击了上传 JSON 按钮');
        
        // 间接触发隐藏的文件输入框
        jsonFileInput.click();
    });
    
    // 为文件输入框添加 change 事件（用户选择文件后触发）
    jsonFileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        
        if (files.length > 0) {
            const selectedFile = files[0];
            console.log('用户选择了文件:', selectedFile.name);
            console.log('文件大小:', selectedFile.size, '字节');
            console.log('文件类型:', selectedFile.type);
            
            // 读取文件内容并填写到 JSON 文本框
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const fileContent = event.target.result;
                
                // 获取 JSON 文本框元素
                const jsonInput = document.getElementById('jsonInput');
                
                if (jsonInput) {
                    jsonInput.value = fileContent;
                    console.log('文件内容已填写到 JSON 文本框');
                } else {
                    console.error('未找到 JSON 文本框元素');
                }
            };
            
            // 以 UTF-8 编码读取文件内容
            reader.readAsText(selectedFile, 'UTF-8');
            
            console.log('开始读取文件内容...');
        } else {
            console.log('用户取消了文件选择');
        }
    });
    
    console.log('上传 JSON 模块初始化完成');
}
