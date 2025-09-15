// 笔记管理器
class NotesManager {
    constructor() {
        this.storageKey = 'notes';
    }

    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 获取所有笔记
    getNotes() {
        const notes = localStorage.getItem(this.storageKey);
        return notes ? JSON.parse(notes) : {};
    }

    // 保存笔记
    saveNote(title, content, id = null) {
        const notes = this.getNotes();
        const now = new Date().toISOString();
        
        if (id && notes[id]) {
            // 更新现有笔记
            notes[id] = {
                ...notes[id],
                title,
                content,
                updatedAt: now
            };
        } else {
            // 创建新笔记
            const newId = id || this.generateId();
            notes[newId] = {
                id: newId,
                title,
                content,
                createdAt: now,
                updatedAt: now
            };
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(notes));
        return notes[id || Object.keys(notes).pop()];
    }

    // 获取单个笔记
    getNote(id) {
        const notes = this.getNotes();
        return notes[id] || null;
    }

    // 删除笔记
    deleteNote(id) {
        const notes = this.getNotes();
        delete notes[id];
        localStorage.setItem(this.storageKey, JSON.stringify(notes));
    }

    // 检查标题是否重复
    isTitleDuplicate(title, excludeId = null) {
        const notes = this.getNotes();
        return Object.values(notes).some(note => 
            note.title === title && note.id !== excludeId
        );
    }

    // 获取所有笔记列表（用于下拉框）
    getNotesList() {
        const notes = this.getNotes();
        return Object.values(notes).map(note => ({
            id: note.id,
            title: note.title,
            createdAt: note.createdAt
        }));
    }
}

// 创建全局笔记管理器实例
const notesManager = new NotesManager();

// 主入口
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
    
    // 初始化 Markdown 实时预览功能
    initMarkdownPreview();
});

/**
 * 初始化 Markdown 实时预览功能
 */
function initMarkdownPreview() {
    const markdownEditor = document.getElementById('markdownEditor');
    const markdownPreview = document.getElementById('markdownPreview');
    
    if (!markdownEditor || !markdownPreview) {
        console.error('找不到必要的 DOM 元素');
        return;
    }
    
    // 配置 marked 选项
    marked.setOptions({
        breaks: true,        // 支持换行符转换为 <br>
        gfm: true,          // 启用 GitHub Flavored Markdown
        sanitize: false,    // 不清理 HTML（允许 HTML 标签）
        smartLists: true,   // 智能列表
        smartypants: true   // 智能标点符号
    });
    
    // 初始化下拉框选择功能
    initNoteSelector();
    
    // 初始化新建笔记对话框
    initNewNoteModal();
    
    // 初始化删除笔记对话框
    initDeleteNoteModal();
    
    // 初始化保存功能
    initSaveFunction();
    
    // 初始化下拉框（加载用户笔记）
    updateNoteSelector();
    
    // 初始渲染
    updatePreview();
    
    // 设置当前选中的笔记
    const noteSelect = document.getElementById('noteSelect');
    if (noteSelect) {
        noteSelect.value = noteSelect.options[0].value;
        // 更新笔记信息显示
        updateNoteInfo();
    }
    
    // 监听输入事件，实现实时预览
    markdownEditor.addEventListener('input', updatePreview);
    
    // 监听粘贴事件
    markdownEditor.addEventListener('paste', () => {
        // 延迟一帧执行，确保粘贴内容已经插入
        setTimeout(updatePreview, 0);
    });
    
    /**
     * 更新预览内容
     */
    function updatePreview() {
        const markdownText = markdownEditor.value;
        
        if (markdownText.trim() === '') {
            markdownPreview.innerHTML = '<p style="color: #6a737d; font-style: italic;">预览将在这里显示...</p>';
            return;
        }
        
        try {
            // 使用 marked 解析 Markdown 并渲染为 HTML
            const htmlContent = marked.parse(markdownText);
            markdownPreview.innerHTML = htmlContent;
        } catch (error) {
            console.error('Markdown 解析错误:', error);
            markdownPreview.innerHTML = '<p style="color: #dc3545;">Markdown 解析错误，请检查语法。</p>';
        }
    }
    
    /**
     * 初始化笔记选择器
     */
    function initNoteSelector() {
        const noteSelect = document.getElementById('noteSelect');
        
        if (!noteSelect) {
            console.error('找不到笔记选择器');
            return;
        }
        
        // 监听选择变化
        noteSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            
            if (selectedValue === 'sample-0') {
                // 加载欢迎页面
                markdownEditor.value = getSampleMarkdown(0);
                updatePreview();
            } else if (selectedValue) {
                // 加载用户创建的笔记
                const note = notesManager.getNote(selectedValue);
                if (note) {
                    markdownEditor.value = note.content || '';
                    updatePreview();
                }
            }
            
            // 更新笔记信息显示
            updateNoteInfo();
        });
    }
    
    /**
     * 初始化新建笔记对话框
     */
    function initNewNoteModal() {
        const newNoteBtn = document.getElementById('newNote');
        const modal = document.getElementById('newNoteModal');
        const cancelBtn = document.getElementById('cancelNewNote');
        const confirmBtn = document.getElementById('confirmNewNote');
        const noteTitleInput = document.getElementById('noteTitle');
        
        if (!newNoteBtn || !modal || !cancelBtn || !confirmBtn || !noteTitleInput) {
            console.error('找不到新建笔记对话框相关元素');
            return;
        }
        
        // 显示对话框
        function showModal() {
            modal.classList.add('show');
            document.body.classList.add('modal-open');
            noteTitleInput.focus();
            noteTitleInput.value = '';
        }
        
        // 隐藏对话框
        function hideModal() {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
        
        // 新建按钮点击事件
        newNoteBtn.addEventListener('click', showModal);
        
        // 取消按钮点击事件
        cancelBtn.addEventListener('click', hideModal);
        
        // 确认按钮点击事件
        confirmBtn.addEventListener('click', () => {
            const title = noteTitleInput.value.trim();
            
            if (!title) {
                // 如果标题为空，聚焦到输入框
                noteTitleInput.focus();
                return;
            }
            
            // 检查标题是否重复
            if (notesManager.isTitleDuplicate(title)) {
                showErrorToast('笔记标题已存在，请使用其他标题');
                noteTitleInput.focus();
                return;
            }
            
            // 创建新笔记
            const newNote = notesManager.saveNote(title, '');
            console.log('创建新笔记:', newNote);
            
            // 关闭对话框
            hideModal();
            
            // 更新下拉框
            updateNoteSelector();
            
            // 选择新创建的笔记
            const noteSelect = document.getElementById('noteSelect');
            noteSelect.value = newNote.id;
            
            // 清空编辑器并显示新笔记
            const markdownEditor = document.getElementById('markdownEditor');
            markdownEditor.value = '';
            updatePreview();
            
            // 显示成功提示
            showOperationToast(`新建笔记"${title}"成功`);
        });
        
        // 点击背景关闭对话框
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal();
            }
        });
        
        // ESC 键关闭对话框
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                hideModal();
            }
        });
        
        // Enter 键确认创建
        noteTitleInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                confirmBtn.click();
            }
        });
    }
    
    /**
     * 初始化删除笔记对话框
     */
    function initDeleteNoteModal() {
        const deleteNoteBtn = document.getElementById('deleteNote');
        const modal = document.getElementById('deleteNoteModal');
        const cancelBtn = document.getElementById('cancelDeleteNote');
        const confirmBtn = document.getElementById('confirmDeleteNote');
        const currentNoteTitleSpan = document.getElementById('currentNoteTitle');
        
        if (!deleteNoteBtn || !modal || !cancelBtn || !confirmBtn || !currentNoteTitleSpan) {
            console.error('找不到删除笔记对话框相关元素');
            return;
        }
        
        
        // 显示对话框
        function showModal() {
            // 更新当前笔记标题
            currentNoteTitleSpan.textContent = getCurrentNoteTitle();
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }
        
        // 隐藏对话框
        function hideModal() {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
        
        // 删除按钮点击事件
        deleteNoteBtn.addEventListener('click', showModal);
        
        // 取消按钮点击事件
        cancelBtn.addEventListener('click', hideModal);
        
        // 确认删除按钮点击事件
        confirmBtn.addEventListener('click', () => {
            const noteSelect = document.getElementById('noteSelect');
            const markdownEditor = document.getElementById('markdownEditor');
            
            if (!noteSelect || !markdownEditor) {
                console.error('找不到必要的元素');
                return;
            }
            
            const selectedValue = noteSelect.value;
            const title = getCurrentNoteTitle();
            
        // 检查是否选择了用户创建的笔记
        if (selectedValue === 'sample-0') {
            showErrorToast('无法删除示例笔记');
            hideModal();
            return;
        }
            
            if (!selectedValue) {
                showErrorToast('请先选择要删除的笔记');
                hideModal();
                return;
            }
            
            // 获取当前笔记
            const currentNote = notesManager.getNote(selectedValue);
            if (!currentNote) {
                showErrorToast('找不到要删除的笔记');
                hideModal();
                return;
            }
            
            // 删除笔记
            notesManager.deleteNote(selectedValue);
            console.log('删除笔记:', currentNote);
            
            // 关闭对话框
            hideModal();
            
            // 更新下拉框（会自动跳转到欢迎页面）
            updateNoteSelector();
            
            // 显示成功提示
            showOperationToast(`删除笔记"${title}"成功`);
        });
        
        // 点击背景关闭对话框
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal();
            }
        });
        
        // ESC 键关闭对话框
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                hideModal();
            }
        });
    }
    
    /**
     * 显示操作成功提示
     * @param {string} message - 提示消息
     */
    function showOperationToast(message) {
        const toast = document.getElementById('operationToast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (!toast || !toastMessage) {
            console.error('找不到提示框元素');
            return;
        }
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    /**
     * 显示错误提示
     * @param {string} message - 错误消息
     */
    function showErrorToast(message) {
        const toast = document.getElementById('errorToast');
        const errorMessage = document.getElementById('errorMessage');
        
        if (!toast || !errorMessage) {
            console.error('找不到错误提示框元素');
            return;
        }
        
        errorMessage.textContent = message;
        toast.classList.add('show');
        
        // 3秒后自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    /**
     * 更新下拉框选项
     */
    function updateNoteSelector() {
        const noteSelect = document.getElementById('noteSelect');
        if (!noteSelect) {
            console.error('找不到笔记选择器');
            return;
        }
        
        // 保存当前选中的值
        const currentValue = noteSelect.value;
        
        // 清空现有选项（保留示例选项）
        noteSelect.innerHTML = '';
        
        // 添加示例选项
        noteSelect.innerHTML = `
            <option value="sample-0">欢迎使用 Notes App</option>
        `;
        
        // 添加用户创建的笔记
        const userNotes = notesManager.getNotesList();
        userNotes.forEach(note => {
            const option = document.createElement('option');
            option.value = note.id;
            option.textContent = note.title;
            noteSelect.appendChild(option);
        });
        
        // 恢复之前选中的值，如果不存在则选择第一个
        if (currentValue && noteSelect.querySelector(`option[value="${currentValue}"]`)) {
            noteSelect.value = currentValue;
        } else {
            noteSelect.value = noteSelect.options[0].value;
        }
        
        // 触发选择变化事件，确保编辑器内容同步
        noteSelect.dispatchEvent(new Event('change'));
    }
    
    /**
     * 获取当前笔记标题
     * @returns {string} 当前笔记标题
     */
    function getCurrentNoteTitle() {
        const noteSelect = document.getElementById('noteSelect');
        if (noteSelect && noteSelect.selectedOptions.length > 0) {
            return noteSelect.selectedOptions[0].textContent;
        }
        return '当前笔记';
    }
    
    /**
     * 格式化日期显示
     * @param {string} dateString - ISO 日期字符串
     * @returns {string} 格式化后的日期
     */
    function formatDate(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        
        // 显示年月日时分
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    /**
     * 更新笔记信息显示
     */
    function updateNoteInfo() {
        const noteSelect = document.getElementById('noteSelect');
        const createdDateSpan = document.getElementById('createdDate');
        const updatedDateSpan = document.getElementById('updatedDate');
        
        if (!noteSelect || !createdDateSpan || !updatedDateSpan) {
            console.error('找不到笔记信息显示元素');
            return;
        }
        
        const selectedValue = noteSelect.value;
        
        // 如果是示例笔记，显示默认信息
        if (selectedValue === 'sample-0') {
            createdDateSpan.textContent = '-';
            updatedDateSpan.textContent = '-';
            return;
        }
        
        // 获取用户笔记信息
        const note = notesManager.getNote(selectedValue);
        if (note) {
            createdDateSpan.textContent = formatDate(note.createdAt);
            updatedDateSpan.textContent = formatDate(note.updatedAt);
        } else {
            createdDateSpan.textContent = '-';
            updatedDateSpan.textContent = '-';
        }
    }
    
    /**
     * 初始化保存功能
     */
    function initSaveFunction() {
        const saveNoteBtn = document.getElementById('saveNote');
        
        if (!saveNoteBtn) {
            console.error('找不到保存按钮元素');
            return;
        }
        
        // 保存按钮点击事件
        saveNoteBtn.addEventListener('click', () => {
            const noteSelect = document.getElementById('noteSelect');
            const markdownEditor = document.getElementById('markdownEditor');
            
            if (!noteSelect || !markdownEditor) {
                console.error('找不到必要的元素');
                return;
            }
            
            const selectedValue = noteSelect.value;
            const content = markdownEditor.value.trim();
            
            // 检查是否选择了用户创建的笔记
            if (selectedValue === 'sample-0') {
                showErrorToast('无法保存示例笔记，请先创建新笔记');
                return;
            }
            
            if (!selectedValue) {
                showErrorToast('请先选择要保存的笔记');
                return;
            }
            
            // 获取当前笔记
            const currentNote = notesManager.getNote(selectedValue);
            if (!currentNote) {
                showErrorToast('找不到要保存的笔记');
                return;
            }
            
            // 检查内容是否有变化
            if (currentNote.content === content) {
                showErrorToast('内容未发生变化，无需保存');
                return;
            }
            
            // 更新笔记内容
            const updatedNote = notesManager.saveNote(currentNote.title, content, selectedValue);
            console.log('保存笔记:', updatedNote);
            
            // 更新笔记信息显示
            updateNoteInfo();
            
            // 显示成功提示
            showOperationToast(`保存笔记"${currentNote.title}"成功`);
        });
    }
    
    // 初始状态：默认显示欢迎文章
    if (markdownEditor.value.trim() === '') {
        markdownEditor.value = getSampleMarkdown(0);
        updatePreview();
    }
}

/**
 * 获取示例 Markdown 内容
 * @param {number} articleIndex - 文章索引 (0)
 * @returns {string} Markdown 内容
 */
function getSampleMarkdown(articleIndex = 0) {
    const articles = [
        // 第一篇：欢迎页面
        `# 欢迎使用 Notes App

## 应用介绍

这是一个功能完整的 Markdown 笔记应用，支持实时预览、本地存储和完整的笔记管理功能。

## 核心功能

### 📝 笔记管理
- **新建笔记**：点击"新建"按钮创建新笔记
- **保存笔记**：实时保存您的编辑内容
- **删除笔记**：安全删除不需要的笔记
- **笔记选择**：通过下拉框快速切换笔记

### ⚡ 实时预览
- 左侧编辑，右侧实时预览
- 支持完整的 Markdown 语法
- 所见即所得的编辑体验

### 💾 本地存储
- 数据保存在浏览器本地
- 自动记录创建和更新时间
- 支持标题重复检查

### 🎨 简洁设计
- 无圆角设计，简洁现代
- 单色配色方案，专注内容
- 响应式布局，适配各种设备

## 使用指南

### 1. 创建新笔记
1. 点击"新建"按钮
2. 输入笔记标题（不能重复）
3. 点击"创建"开始编辑

### 2. 编辑笔记
- 在左侧编辑器中输入 Markdown 内容
- 右侧会实时显示渲染结果
- 支持所有标准 Markdown 语法

### 3. 保存笔记
- 点击"保存"按钮保存更改
- 系统会显示保存成功提示
- 自动更新修改时间

### 4. 删除笔记
- 选择要删除的笔记
- 点击"删除"按钮
- 确认删除操作

## Markdown 语法支持

### 基础格式
- **粗体文本**
- *斜体文本*
- \`行内代码\`

### 标题
\`# 一级标题\`
\`## 二级标题\`
\`### 三级标题\`

### 列表
- 无序列表项
- 另一个列表项

1. 有序列表项
2. 另一个有序列表项

### 代码块
\`\`\`javascript
function example() {
    console.log("Hello, World!");
}
\`\`\`

### 引用
> 这是一个引用块

### 链接和图片
[链接文本](https://example.com)
![图片描述](https://example.com/image.jpg)

## 注意事项

- 笔记标题不能重复
- 示例笔记无法删除或保存
- 所有数据保存在浏览器本地
- 支持键盘快捷键操作

---

**开始创建您的第一个笔记吧！**`,

    ];
    
    return articles[articleIndex] || articles[0];
}

/**
 * 获取所有示例文章
 * @returns {Array} 文章数组
 */
function getAllSampleArticles() {
    return [
        {
            id: 'sample-0',
            title: '欢迎使用 Notes App',
            content: getSampleMarkdown(0),
            createdAt: new Date('2024-01-01T09:00:00.000Z').toISOString(),
            updatedAt: new Date('2024-01-01T09:00:00.000Z').toISOString()
        }
    ];
}