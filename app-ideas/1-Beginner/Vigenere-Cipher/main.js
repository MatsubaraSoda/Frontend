/**
 * 维吉尼亚密码加密工具
 * 使用方阵查表法实现加密和解密
 */

// ============= 维吉尼亚方阵初始化 =============

/**
 * 生成 26×26 的维吉尼亚方阵
 * 每一行代表使用不同密钥字母的凯撒密码
 */
function generateVigenereSquare() {
    const square = [];
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // 生成 26 行
    for (let row = 0; row < 26; row++) {
        const rowArray = [];
        // 每行 26 列
        for (let col = 0; col < 26; col++) {
            // 当前位置的字符索引 = (行索引 + 列索引) % 26
            const charIndex = (row + col) % 26;
            rowArray.push(ALPHABET[charIndex]);
        }
        square.push(rowArray);
    }
    
    return square;
}

// 创建全局方阵
const VIGENERE_SQUARE = generateVigenereSquare();
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// 存储原始明文，用于比较功能
let originalPlaintext = '';

// ============= 核心加密解密函数 =============

/**
 * 获取字母在字母表中的索引
 * @param {string} letter - 单个字母
 * @returns {number} 索引值 (0-25)，如果不是字母返回 -1
 */
function getLetterIndex(letter) {
    const upperLetter = letter.toUpperCase();
    const index = ALPHABET.indexOf(upperLetter);
    return index;
}

/**
 * 使用维吉尼亚方阵加密单个字母
 * @param {string} plainLetter - 明文字母
 * @param {string} keyLetter - 密钥字母
 * @returns {string} 密文字母
 */
function encryptLetter(plainLetter, keyLetter) {
    const plainIndex = getLetterIndex(plainLetter);
    const keyIndex = getLetterIndex(keyLetter);
    
    if (plainIndex === -1 || keyIndex === -1) {
        return plainLetter; // 非字母字符保持不变
    }
    
    // 从方阵中查表：行=密钥索引，列=明文索引
    const cipherLetter = VIGENERE_SQUARE[keyIndex][plainIndex];
    
    // 保持原始大小写
    if (plainLetter === plainLetter.toLowerCase()) {
        return cipherLetter.toLowerCase();
    }
    return cipherLetter;
}

/**
 * 使用维吉尼亚方阵解密单个字母
 * @param {string} cipherLetter - 密文字母
 * @param {string} keyLetter - 密钥字母
 * @returns {string} 明文字母
 */
function decryptLetter(cipherLetter, keyLetter) {
    const cipherIndex = getLetterIndex(cipherLetter);
    const keyIndex = getLetterIndex(keyLetter);
    
    if (cipherIndex === -1 || keyIndex === -1) {
        return cipherLetter; // 非字母字符保持不变
    }
    
    // 在方阵的对应行中查找密文字母的位置
    const row = VIGENERE_SQUARE[keyIndex];
    const plainIndex = row.indexOf(ALPHABET[cipherIndex]);
    
    const plainLetter = ALPHABET[plainIndex];
    
    // 保持原始大小写
    if (cipherLetter === cipherLetter.toLowerCase()) {
        return plainLetter.toLowerCase();
    }
    return plainLetter;
}

/**
 * 扩展密钥以匹配文本长度
 * @param {string} text - 原文本
 * @param {string} key - 密钥
 * @returns {string} 扩展后的密钥
 */
function extendKey(text, key) {
    if (key.length === 0) return '';
    
    let extendedKey = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        // 只对字母位置扩展密钥
        if (getLetterIndex(text[i]) !== -1) {
            extendedKey += key[keyIndex % key.length];
            keyIndex++;
        } else {
            // 非字母位置用空格占位
            extendedKey += ' ';
        }
    }
    
    return extendedKey;
}

/**
 * 加密文本
 * @param {string} plaintext - 明文
 * @param {string} key - 密钥
 * @returns {string} 密文
 */
function encrypt(plaintext, key) {
    if (!plaintext || !key) {
        return '';
    }
    
    const extendedKey = extendKey(plaintext, key);
    let ciphertext = '';
    
    for (let i = 0; i < plaintext.length; i++) {
        if (extendedKey[i] === ' ') {
            // 非字母字符保持不变
            ciphertext += plaintext[i];
        } else {
            ciphertext += encryptLetter(plaintext[i], extendedKey[i]);
        }
    }
    
    return ciphertext;
}

/**
 * 解密文本
 * @param {string} ciphertext - 密文
 * @param {string} key - 密钥
 * @returns {string} 明文
 */
function decrypt(ciphertext, key) {
    if (!ciphertext || !key) {
        return '';
    }
    
    const extendedKey = extendKey(ciphertext, key);
    let plaintext = '';
    
    for (let i = 0; i < ciphertext.length; i++) {
        if (extendedKey[i] === ' ') {
            // 非字母字符保持不变
            plaintext += ciphertext[i];
        } else {
            plaintext += decryptLetter(ciphertext[i], extendedKey[i]);
        }
    }
    
    return plaintext;
}

// ============= DOM 元素获取 =============

const plaintextInput = document.getElementById('plaintext');
const keyInput = document.getElementById('encryption-key');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const compareBtn = document.getElementById('compare-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const resultOutput = document.getElementById('result');
const resultStatus = document.getElementById('result-status');
const charCount = document.querySelector('.char-count');
const messageSection = document.getElementById('message-section');
const messageBox = document.getElementById('message-box');

// ============= UI 辅助函数 =============

/**
 * 显示消息提示
 * @param {string} text - 消息文本
 * @param {string} type - 消息类型 ('success' 或 'error')
 */
function showMessage(text, type = 'success') {
    const icon = type === 'success' ? '✓' : '✗';
    messageBox.className = `message-box ${type}`;
    messageBox.querySelector('.message-icon').textContent = icon;
    messageBox.querySelector('.message-text').textContent = text;
    messageSection.style.display = 'block';
}

/**
 * 隐藏消息提示
 */
function hideMessage() {
    messageSection.style.display = 'none';
}

/**
 * 显示结果状态
 * @param {string} text - 状态文本
 * @param {string} type - 状态类型 ('success' 或 'error')
 */
function showResultStatus(text, type = 'success') {
    resultStatus.textContent = text;
    resultStatus.className = `result-status ${type}`;
}

/**
 * 更新字符计数
 */
function updateCharCount() {
    const count = plaintextInput.value.length;
    charCount.textContent = `字符数：${count}`;
}

/**
 * 验证输入
 * @returns {boolean} 是否验证通过
 */
function validateInput() {
    const plaintext = plaintextInput.value.trim();
    const key = keyInput.value.trim();
    
    if (!plaintext) {
        showMessage('请输入明文消息', 'error');
        return false;
    }
    
    if (!key) {
        showMessage('请输入加密密钥', 'error');
        return false;
    }
    
    // 验证密钥是否只包含字母
    const keyLettersOnly = key.replace(/[^a-zA-Z]/g, '');
    if (keyLettersOnly.length === 0) {
        showMessage('密钥必须包含至少一个字母', 'error');
        return false;
    }
    
    return true;
}

// ============= 事件处理函数 =============

/**
 * 加密按钮点击事件
 */
function handleEncrypt() {
    hideMessage();
    
    if (!validateInput()) {
        return;
    }
    
    const plaintext = plaintextInput.value;
    const key = keyInput.value.replace(/[^a-zA-Z]/g, ''); // 只使用字母作为密钥
    
    // 保存原始明文用于后续比较
    originalPlaintext = plaintext;
    
    // 执行加密
    const ciphertext = encrypt(plaintext, key);
    
    // 显示结果
    resultOutput.value = ciphertext;
    showResultStatus('✓ 加密成功！', 'success');
    
    // 更新按钮状态
    decryptBtn.disabled = false;
    compareBtn.style.display = 'none';
    copyBtn.style.display = 'inline-block';
}

/**
 * 解密按钮点击事件
 */
function handleDecrypt() {
    hideMessage();
    
    const ciphertext = resultOutput.value.trim();
    const key = keyInput.value.replace(/[^a-zA-Z]/g, '');
    
    if (!ciphertext) {
        showMessage('没有可解密的内容', 'error');
        return;
    }
    
    if (!key) {
        showMessage('请输入解密密钥', 'error');
        return;
    }
    
    // 执行解密
    const plaintext = decrypt(ciphertext, key);
    
    // 显示结果
    resultOutput.value = plaintext;
    showResultStatus('✓ 解密成功！', 'success');
    
    // 显示比较按钮
    compareBtn.style.display = 'inline-block';
}

/**
 * 比较按钮点击事件（Bonus 功能）
 */
function handleCompare() {
    const decryptedText = resultOutput.value;
    
    if (originalPlaintext === decryptedText) {
        showMessage('✓ 验证成功！原始消息与解密后的消息完全一致。', 'success');
    } else {
        showMessage('✗ 验证失败！解密后的消息与原始消息不一致。可能是密钥错误或消息被篡改。', 'error');
    }
}

/**
 * 重置按钮点击事件
 */
function handleReset() {
    // 清空所有输入和输出
    plaintextInput.value = '';
    keyInput.value = '';
    resultOutput.value = '';
    originalPlaintext = '';
    
    // 隐藏所有提示
    hideMessage();
    resultStatus.textContent = '';
    resultStatus.className = 'result-status';
    
    // 重置按钮状态
    decryptBtn.disabled = true;
    compareBtn.style.display = 'none';
    copyBtn.style.display = 'none';
    
    // 更新字符计数
    updateCharCount();
    
    // 聚焦到明文输入框
    plaintextInput.focus();
}

/**
 * 复制按钮点击事件
 */
function handleCopy() {
    const text = resultOutput.value;
    
    if (!text) {
        showMessage('没有可复制的内容', 'error');
        return;
    }
    
    // 复制到剪贴板
    navigator.clipboard.writeText(text).then(() => {
        showMessage('✓ 已复制到剪贴板', 'success');
        setTimeout(hideMessage, 2000);
    }).catch(err => {
        // 降级方案：使用传统方法
        resultOutput.select();
        document.execCommand('copy');
        showMessage('✓ 已复制到剪贴板', 'success');
        setTimeout(hideMessage, 2000);
    });
}

/**
 * 关闭消息按钮点击事件
 */
function handleCloseMessage() {
    hideMessage();
}

// ============= 事件监听器绑定 =============

// 按钮事件
encryptBtn.addEventListener('click', handleEncrypt);
decryptBtn.addEventListener('click', handleDecrypt);
compareBtn.addEventListener('click', handleCompare);
resetBtn.addEventListener('click', handleReset);
copyBtn.addEventListener('click', handleCopy);
messageBox.querySelector('.message-close').addEventListener('click', handleCloseMessage);

// 输入框事件
plaintextInput.addEventListener('input', updateCharCount);

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter 执行加密
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!encryptBtn.disabled) {
            handleEncrypt();
        }
    }
    
    // Esc 关闭消息
    if (e.key === 'Escape') {
        hideMessage();
    }
});

// ============= 初始化 =============

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    updateCharCount();
    plaintextInput.focus();
    
    console.log('维吉尼亚密码工具已加载');
    console.log('维吉尼亚方阵大小:', VIGENERE_SQUARE.length, 'x', VIGENERE_SQUARE[0].length);
    console.log('方阵第一行 (A):', VIGENERE_SQUARE[0].join(''));
    console.log('方阵第十一行 (K):', VIGENERE_SQUARE[10].join(''));
});

