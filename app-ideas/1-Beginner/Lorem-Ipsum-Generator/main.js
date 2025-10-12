import { LoremIpsum } from "lorem-ipsum";

// 获取 DOM 元素
const number = document.getElementById('number');
const generate = document.getElementById('generate');
const result = document.getElementById('result');

// 中文词汇库 - 古汉语文字
const chineseWords = [
    // 文言虚词
    '之', '乎', '者', '也', '矣', '焉', '哉', '兮', '耶', '歟', '歟', '歟', '歟', '歟', '歟',
    '而', '以', '於', '為', '與', '其', '所', '何', '孰', '安', '胡', '奚', '曷', '盍', '豈',
    '乃', '則', '故', '然', '若', '如', '當', '既', '已', '將', '且', '或', '莫', '非', '勿',
    
    // 人称代词
    '吾', '余', '予', '朕', '寡人', '孤', '臣', '妾', '僕', '奴', '婢', '僮', '隸', '役',
    '爾', '汝', '若', '乃', '子', '君', '卿', '公', '侯', '伯', '子', '男', '士', '庶', '民',
    '彼', '其', '厥', '伊', '渠', '他', '她', '它', '此', '是', '斯', '茲', '今', '昔', '古',
    
    // 自然万物
    '天', '地', '人', '日', '月', '星', '辰', '雲', '雨', '雪', '風', '雷', '電', '霜', '露',
    '山', '川', '河', '海', '湖', '澤', '池', '泉', '井', '溪', '澗', '谷', '峰', '嶺', '丘',
    '林', '木', '草', '花', '葉', '根', '枝', '幹', '果', '實', '種', '芽', '苗', '樹', '竹',
    '鳥', '獸', '魚', '蟲', '蛇', '虎', '豹', '狼', '狐', '兔', '鹿', '馬', '牛', '羊', '豬',
    '龍', '鳳', '麟', '龜', '鶴', '雁', '燕', '雀', '鷹', '鷲', '鴉', '鵲', '鶯', '鷺', '鳩',
    
    // 经典文献
    '易', '書', '詩', '禮', '樂', '春秋', '論語', '孟子', '大學', '中庸', '孝經', '爾雅',
    '老子', '莊子', '荀子', '墨子', '韓非子', '孫子', '吳子', '司馬法', '六韜', '三略',
    '史記', '漢書', '後漢書', '三國志', '晉書', '宋書', '齊書', '梁書', '陳書', '魏書',
    
    // 道德品质
    '道', '德', '仁', '義', '禮', '智', '信', '忠', '孝', '廉', '恥', '勇', '毅', '剛', '柔',
    '和', '諧', '美', '善', '真', '誠', '敬', '愛', '慈', '悲', '喜', '怒', '哀', '樂', '憂',
    '玄', '妙', '奧', '秘', '深', '遠', '高', '大', '廣', '博', '厚', '重', '輕', '薄', '細',
    '精', '微', '密', '嚴', '謹', '慎', '勤', '儉', '樸', '素', '雅', '俗', '貴', '賤', '富',
    
    // 时间空间
    '春', '夏', '秋', '冬', '朝', '夕', '晝', '夜', '晨', '昏', '午', '晚', '早', '遲', '速',
    '東', '西', '南', '北', '中', '上', '下', '左', '右', '前', '後', '內', '外', '中', '央',
    '長', '短', '寬', '窄', '厚', '薄', '高', '低', '深', '淺', '遠', '近', '大', '小', '多',
    '方', '圓', '正', '斜', '直', '曲', '平', '陡', '緩', '急', '快', '慢', '新', '舊', '古',
    
    // 颜色
    '青', '赤', '黃', '白', '黑', '紫', '綠', '藍', '紅', '粉', '灰', '棕', '金', '銀', '銅',
    '朱', '丹', '緋', '絳', '茜', '赭', '褐', '赭', '蒼', '碧', '翠', '黛', '墨', '玄', '烏',
    
    // 动作行为
    '行', '走', '跑', '飛', '游', '泳', '坐', '立', '臥', '睡', '醒', '起', '來', '去', '歸',
    '看', '聽', '聞', '嗅', '嘗', '觸', '摸', '握', '持', '拿', '放', '取', '給', '受', '得',
    '說', '言', '語', '話', '談', '論', '議', '辯', '問', '答', '應', '對', '呼', '喚', '叫',
    '思', '想', '念', '憶', '記', '忘', '知', '識', '學', '習', '教', '導', '化', '變', '改',
    
    // 情感状态
    '喜', '怒', '哀', '樂', '愛', '恨', '欲', '懼', '驚', '恐', '憂', '愁', '悲', '歡', '欣',
    '安', '靜', '寧', '和', '平', '順', '逆', '難', '易', '苦', '甘', '酸', '甜', '辣', '鹹',
    '暖', '涼', '熱', '冷', '溫', '寒', '燥', '濕', '乾', '潤', '滑', '糙', '軟', '硬', '脆',
    
    // 数量概念
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '萬', '億', '兆',
    '半', '全', '整', '零', '單', '雙', '對', '偶', '奇', '正', '負', '加', '減', '乘', '除',
    '首', '末', '初', '終', '始', '結', '開', '關', '啟', '閉', '通', '塞', '達', '至', '及'
];

// 创建 LoremIpsum 实例
const lorem = new LoremIpsum({
    words: chineseWords,
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

/**
 * 将生成的单词转换为中文格式
 * @param {string} words - 原始生成的单词文本
 * @returns {string} 处理后的中文单词
 */
function toChineseWords(words) {
    // 去除所有空白字符
    return words.replace(/\s+/g, '');
}

/**
 * 将生成的句子转换为中文格式
 * @param {string} sentences - 原始生成的句子文本
 * @returns {string} 处理后的中文句子
 */
function toChineseSentences(sentences) {
    // 去除所有空白字符
    sentences = sentences.replace(/\s+/g, '');
    // 将英文句号替换为中文句号
    sentences = sentences.replace(/\./g, '。');
    return sentences;
}

/**
 * 将生成的段落转换为中文格式
 * @param {string} paragraphs - 原始生成的段落文本
 * @returns {string} 处理后的中文段落
 */
function toChineseParagraphs(paragraphs) {
    // 去除所有空白字符
    paragraphs = paragraphs.replace(/\s+/g, '');
    // 将英文句号替换为中文句号
    paragraphs = paragraphs.replace(/\./g, '。');
    // 注意：段落缩进由 CSS 的 text-indent 处理，不在此处添加空格
    return paragraphs;
}

document.addEventListener('DOMContentLoaded', () => {
    generate.addEventListener('click', () => {
        let count = 1;  // 默认值
        
        try {
            // 检查输入值是否为有效数字
            const inputValue = number.value.trim();
            
            // 检查是否为空或只包含空白字符
            if (!inputValue) {
                throw new Error('输入不能为空');
            }
            
            // 检查是否只包含数字字符
            if (!/^\d+$/.test(inputValue)) {
                throw new Error('请输入有效的数字');
            }
            
            // 转换为数字
            const parsedCount = parseInt(inputValue, 10);
            
            // 检查转换后的数字是否有效
            if (isNaN(parsedCount) || parsedCount <= 0) {
                throw new Error('请输入大于0的正整数');
            }
            
            // 检查数字范围（可选：防止生成过多段落）
            if (parsedCount > 100) {
                throw new Error('段落数量不能超过100');
            }
            
            count = parsedCount;
            
        } catch (error) {
            // 显示错误信息
            alert(`输入错误: ${error.message}`);
            console.error('数字验证错误:', error.message);
            return;  // 停止执行
        }
        
        const paragraphs = [];
        
        // 循环生成每个段落
        for (let i = 0; i < count; i++) {
            const singleParagraph = lorem.generateParagraphs(1);
            paragraphs.push(singleParagraph);
        }
        
        // 为每个段落创建 <p> 元素并添加到 result 中
        result.innerHTML = '';  // 清空之前的内容
        
        paragraphs.forEach((paragraph, index) => {
            const pElement = document.createElement('p');
            pElement.className = 'paragraph';
            pElement.innerHTML = toChineseParagraphs(paragraph);
            result.appendChild(pElement);
        });
    });
});

// ------------------------------------------------------------------------------------------------
// 测试代码
// ------------------------------------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//     // 生成原始文本
//     const rawWords = lorem.generateWords(5);
//     const rawSentences = lorem.generateSentences(3);
//     const rawParagraphs = lorem.generateParagraphs(1);
    
//     // 转换为中文格式
//     const testWords = toChineseWords(rawWords);
//     const testSentences = toChineseSentences(rawSentences);
//     const testParagraphs = toChineseParagraphs(rawParagraphs);

//     // 控制台打印
//     console.log('单词测试:', testWords);
//     console.log('句子测试:', testSentences);
//     console.log('段落测试:', testParagraphs);

//     // 获取容器元素
//     const container = document.querySelector('.container');
    
//     // 创建测试内容
//     const testContent = `
//         <h1>Lorem Ipsum 中文版测试</h1>
//         <h2>单词测试 (5个单词):</h2>
//         <p>${testWords}</p>
        
//         <h2>句子测试 (3个句子):</h2>
//         <p>${testSentences}</p>
        
//         <h2>段落测试 (2个段落):</h2>
//         <div>${testParagraphs}</div>       
        
//     `;
    
//     // 将内容插入到容器中
//     container.innerHTML = testContent;
// });