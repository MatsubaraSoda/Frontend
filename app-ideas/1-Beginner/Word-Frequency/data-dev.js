/**
 * 开发阶段测试数据
 * 用于测试词频统计功能
 */

const testData = {
    // 简单短文本
    simple: "hello world hello",
    
    // 基础测试文本
    basic: "The quick brown fox jumps over the lazy dog. The dog was really lazy.",
    
    // 中等长度文本 - 包含重复词汇
    medium: `
        Hello world. Hello everyone. Welcome to the word frequency application.
        This application counts the frequency of words in a text.
        The word frequency is very useful for text analysis.
        Text analysis is important for understanding word patterns.
        Word patterns help us understand the text better.
    `,
    
    // 包含各种标点符号的文本
    punctuation: `
        Hello, world! How are you? I'm fine, thank you.
        This is a test. Testing, testing... one, two, three!
        Words with punctuation: don't, can't, won't, it's.
        Numbers like 123 and symbols like @#$ should be handled carefully.
    `,
    
    // 文学性文本 - 莎士比亚风格
    literary: `
        To be or not to be, that is the question.
        Whether 'tis nobler in the mind to suffer
        The slings and arrows of outrageous fortune,
        Or to take arms against a sea of troubles,
        And by opposing end them. To die, to sleep,
        No more; and by a sleep to say we end
        The heart-ache and the thousand natural shocks
        That flesh is heir to.
    `,
    
    // 技术性文本
    technical: `
        JavaScript is a programming language. Programming languages are used to write software.
        Software development requires understanding of programming concepts.
        Concepts like variables, functions, and objects are fundamental.
        Functions can be called multiple times. Objects contain properties and methods.
        The JavaScript language has evolved over time with new features.
    `,
    
    // 重复词汇较多的文本 - 便于测试排序
    repetitive: `
        apple apple apple apple apple
        banana banana banana banana
        cherry cherry cherry
        date date
        elderberry
    `,
    
    // 长文本 - 接近字符上限
    long: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        
        The importance of word frequency analysis cannot be overstated. Word frequency helps us understand text patterns.
        Text patterns reveal important information about the document. Document analysis is crucial for many applications.
        Applications range from search engines to sentiment analysis. Analysis of text data provides valuable insights.
        
        In natural language processing, word frequency is a fundamental concept. Concepts in NLP build upon each other.
        Processing of natural language requires sophisticated algorithms. Algorithms must handle various edge cases.
        Cases such as punctuation, capitalization, and special characters need careful consideration.
        
        The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.
        Alphabet coverage is important for font testing. Testing ensures that all characters display correctly.
        Correctly handling text input is essential for any text processing application.
        
        Word frequency analysis has many practical applications. Applications include search engine optimization.
        Optimization of content requires understanding keyword density. Density of keywords affects search rankings.
        Rankings determine visibility in search results. Results can significantly impact web traffic.
        
        Text analysis tools help writers improve their content. Content quality depends on word choice and variety.
        Variety in vocabulary makes text more engaging. Engaging content keeps readers interested.
        Interested readers are more likely to share content. Content sharing increases reach and engagement.
        
        Machine learning algorithms often use word frequency as a feature. Features help models understand text.
        Text understanding is fundamental to natural language processing. Processing capabilities continue to improve.
        Improvement in NLP enables better applications. Applications benefit users in countless ways.
    `,
    
    // 空字符串 - 测试错误处理
    empty: "",
    
    // 只有空格和换行 - 测试边界情况
    whitespace: "   \n\n   \n   ",
    
    // 单个单词
    single: "hello",
    
    // 混合大小写
    mixedCase: "Hello hello HELLO HeLLo hELLo world WORLD World"
};

// 用于开发调试的辅助函数
const devHelpers = {
    /**
     * 获取所有测试数据的键名
     */
    getTestKeys: function() {
        return Object.keys(testData);
    },
    
    /**
     * 根据键名获取测试数据
     */
    getTestData: function(key) {
        return testData[key] || null;
    },
    
    /**
     * 获取测试数据的统计信息
     */
    getTestStats: function(key) {
        const text = testData[key];
        if (!text) return null;
        
        return {
            key: key,
            length: text.length,
            lines: text.split('\n').length,
            preview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
        };
    },
    
    /**
     * 列出所有测试数据及其统计信息
     */
    listAll: function() {
        return this.getTestKeys().map(key => this.getTestStats(key));
    }
};

// 控制台输出测试数据列表（仅用于开发）
console.log('📊 测试数据已加载');
console.log('可用的测试数据:', devHelpers.getTestKeys().join(', '));
console.log('使用 devHelpers.listAll() 查看所有测试数据详情');

// ES6 导出
export { testData, devHelpers };

