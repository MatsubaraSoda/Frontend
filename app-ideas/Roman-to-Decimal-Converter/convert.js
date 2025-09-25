
class RomanConverter {
    constructor() {
        // 预编译正则表达式，提高性能
        // 只包含单个罗马数字字符，不包含组合字符
        // 按长度降序排列（优先匹配长模式）
        this.romanSymbolRegex = /(C̅̅|M̅̅|X̅̅|L̅̅|D̅̅|V̅̅|C̅|M̅|X̅|L̅|D̅|V̅|I|V|X|L|C|D|M)/g;
        
        // 基于10种精确情况的组别正则表达式（精确匹配）
        // 每个组别有10种情况：0(空), 1, 2, 3, 4, 5, 6, 7, 8, 9
        // 按长度降序排列，优先匹配长模式
        this.romanPreciseRegex = /^(C̅̅C̅̅C̅̅|D̅̅C̅̅C̅̅|C̅̅C̅̅|D̅̅C̅̅|C̅̅D̅̅|C̅̅M̅̅|C̅̅|D̅̅)?(L̅̅X̅̅X̅̅X̅̅|X̅̅X̅̅X̅̅|L̅̅X̅̅X̅̅|X̅̅X̅̅|X̅̅L̅̅|L̅̅X̅̅|X̅̅C̅̅|X̅̅|L̅̅)?(V̅̅M̅M̅M̅|M̅M̅M̅|V̅̅M̅M̅|M̅V̅̅|V̅̅M̅|M̅X̅̅|M̅M̅|V̅̅|M̅)?(D̅C̅C̅C̅|C̅C̅C̅|D̅C̅C̅|C̅C̅|C̅D̅|D̅C̅|C̅M̅|C̅|D̅)?(L̅X̅X̅X̅|X̅X̅X̅|L̅X̅X̅|X̅X̅|X̅L̅|L̅X̅|X̅C̅|X̅|L̅)?(V̅MMM|V̅MM|V̅M|MV̅|MX̅|MMM|MM|V̅|M)?(DCCC|CCC|DCC|CC|CD|DC|CM|C|D)?(LXXX|XXX|LXX|XX|XL|LX|XC|X|L)?(VIII|III|VII|II|IV|VI|IX|I|V)?$/;
        // 按数位组别硬编码的罗马数字映射表（支持1-999,999,999）
        this.arbicMap = {
            // 个位 (0-9)
            ones: {
                0: '',      // 0对应空字符串
                1: 'I',
                2: 'II',
                3: 'III',
                4: 'IV',
                5: 'V',
                6: 'VI',
                7: 'VII',
                8: 'VIII',
                9: 'IX'
            },

            // 十位 (0-90)
            tens: {
                0: '',      // 0对应空字符串
                1: 'X',
                2: 'XX',
                3: 'XXX',
                4: 'XL',
                5: 'L',
                6: 'LX',
                7: 'LXX',
                8: 'LXXX',
                9: 'XC'
            },

            // 百位 (0-900)
            hundreds: {
                0: '',      // 0对应空字符串
                1: 'C',
                2: 'CC',
                3: 'CCC',
                4: 'CD',
                5: 'D',
                6: 'DC',
                7: 'DCC',
                8: 'DCCC',
                9: 'CM'
            },

            // 千位 (0-9000)
            thousands: {
                0: '',      // 0对应空字符串
                1: 'M',
                2: 'MM',
                3: 'MMM',
                4: 'MV̅',
                5: 'V̅',
                6: 'V̅M',
                7: 'V̅MM',
                8: 'V̅MMM',
                9: 'MX̅'
            },

            // 万位 (0-90000)
            tenThousands: {
                0: '',      // 0对应空字符串
                1: 'X̅',
                2: 'X̅X̅',
                3: 'X̅X̅X̅',
                4: 'X̅L̅',
                5: 'L̅',
                6: 'L̅X̅',
                7: 'L̅X̅X̅',
                8: 'L̅X̅X̅X̅',
                9: 'X̅C̅'
            },

            // 十万位 (0-900000)
            hundredThousands: {
                0: '',      // 0对应空字符串
                1: 'C̅',
                2: 'C̅C̅',
                3: 'C̅C̅C̅',
                4: 'C̅D̅',
                5: 'D̅',
                6: 'D̅C̅',
                7: 'D̅C̅C̅',
                8: 'D̅C̅C̅C̅',
                9: 'C̅M̅'
            },

            // 百万位 (0-9000000)
            millions: {
                0: '',      // 0对应空字符串
                1: 'M̅',
                2: 'M̅M̅',
                3: 'M̅M̅M̅',
                4: 'M̅V̅̅',
                5: 'V̅̅',
                6: 'V̅̅M̅',
                7: 'V̅̅M̅M̅',
                8: 'V̅̅M̅M̅M̅',
                9: 'M̅X̅̅'
            },

            // 千万位 (0-90000000)
            tenMillions: {
                0: '',      // 0对应空字符串
                1: 'X̅̅',
                2: 'X̅̅X̅̅',
                3: 'X̅̅X̅̅X̅̅',
                4: 'X̅̅L̅̅',
                5: 'L̅̅',
                6: 'L̅̅X̅̅',
                7: 'L̅̅X̅̅X̅̅',
                8: 'L̅̅X̅̅X̅̅X̅̅',
                9: 'X̅̅C̅̅'
            },

            // 亿位 (0-900000000)
            hundredMillions: {
                0: '',      // 0对应空字符串
                1: 'C̅̅',
                2: 'C̅̅C̅̅',
                3: 'C̅̅C̅̅C̅̅',
                4: 'C̅̅D̅̅',
                5: 'D̅̅',
                6: 'D̅̅C̅̅',
                7: 'D̅̅C̅̅C̅̅',
                8: 'D̅̅C̅̅C̅̅C̅̅',
                9: 'C̅̅M̅̅'
            }
        };

        // 罗马数字到阿拉伯数字的映射表
        // 包含所有可能的字符组合，包括单独的横线字符
        this.romanMap = {
            // 基础符号
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000,

            // 单横线符号（×1000）
            'V̅': 5000,
            'X̅': 10000,
            'L̅': 50000,
            'C̅': 100000,
            'D̅': 500000,
            'M̅': 1000000,
            
            // 千位组合字符
            'MV̅': 4000,
            'V̅M': 6000,
            'V̅MM': 7000,
            'V̅MMM': 8000,
            'MX̅': 9000,

            // 双横线符号（×1000000）
            'V̅̅': 5000000,
            'X̅̅': 10000000,
            'L̅̅': 50000000,
            'C̅̅': 100000000,
            'D̅̅': 500000000,
            'M̅̅': 1000000000
        };

        // 数位组别配置（常量，避免重复创建）
        this.DIGIT_GROUPS = [
            { name: 'hundredMillions', multiplier: 100000000 }, // 亿位
            { name: 'tenMillions', multiplier: 10000000 },      // 千万位
            { name: 'millions', multiplier: 1000000 },          // 百万位
            { name: 'hundredThousands', multiplier: 100000 },   // 十万位
            { name: 'tenThousands', multiplier: 10000 },        // 万位
            { name: 'thousands', multiplier: 1000 },            // 千位
            { name: 'hundreds', multiplier: 100 },              // 百位
            { name: 'tens', multiplier: 10 },                   // 十位
            { name: 'ones', multiplier: 1 }                     // 个位
        ];
    }
    /**
     * 阿拉伯数字转罗马数字
     * @param {number} arabicNumber - 阿拉伯数字 (1-999999999)
     * @returns {string} 罗马数字
     */
    arabicToRoman(arabicNumber) {
        // 首先进行验证：检查阿拉伯数字是否有效
        if (!this.#isArabic(arabicNumber)) {
            return ''; // 验证失败返回空字符串，表示无效
        }

        let result = '';
        let remaining = arabicNumber;

        // 遍历每个数位组（使用预定义的常量）
        for (let group of this.DIGIT_GROUPS) {
            const digit = Math.floor(remaining / group.multiplier);

            if (digit > 0) {
                // 获取该数位的罗马数字表示
                const romanDigit = this.#getRomanDigit(digit, group.name);
                result += romanDigit;
                remaining -= digit * group.multiplier;
            }
        }

        return result;
    }

    /**
     * 根据数位和数字获取对应的罗马数字（私有方法）
     * @param {number} digit - 数字 (0-9)
     * @param {string} group - 数位组别
     * @returns {string} 对应的罗马数字
     */
    #getRomanDigit(digit, group) {
        return this.arbicMap[group][digit] || '';
    }

    /**
     * 获取罗马数字符号对应的阿拉伯数字值（私有方法）
     * @param {string} romanSymbol - 罗马数字符号
     * @returns {number} 对应的阿拉伯数字值
     */
    #getRomanValue(romanSymbol) {
        return this.romanMap[romanSymbol] || 0;
    }

    /**
     * 验证阿拉伯数字是否有效（私有方法）
     * @param {number} arabicNumber - 待验证的阿拉伯数字
     * @returns {boolean} 是否有效
     */
    #isArabic(arabicNumber) {
        // 检查数据类型：必须是数字
        if (typeof arabicNumber !== 'number') {
            return false;
        }

        // 检查是否为整数
        if (!Number.isInteger(arabicNumber)) {
            return false;
        }

        // 检查是否为有效数字（非NaN, 非Infinity）
        if (!Number.isFinite(arabicNumber)) {
            return false;
        }

        // 检查范围：1 ≤ number ≤ 999,999,999
        if (arabicNumber < 1 || arabicNumber > 999999999) {
            return false;
        }

        return true;
    }

    /**
     * 验证罗马数字字符串是否有效（私有方法）
     * @param {string} romanNumber - 待验证的罗马数字字符串
     * @returns {boolean} 是否有效
     */
    #isRoman(romanNumber) {
        // 1. 数据类型检查：必须是字符串
        if (typeof romanNumber !== 'string') {
            return false;
        }

        // 2. 非空检查
        if (romanNumber.length === 0) {
            return false;
        }

        // 3. 字符有效性检查：使用预编译的正则表达式
        // 重置正则表达式的lastIndex，避免全局标志的影响
        this.romanSymbolRegex.lastIndex = 0;
        
        // 使用test()方法检查是否只包含有效字符
        // 如果字符串完全由有效符号组成，则应该匹配整个字符串
        const matches = romanNumber.match(this.romanSymbolRegex);
        
        // 检查匹配结果
        if (!matches || matches.length === 0) {
            return false; // 没有匹配到任何有效符号
        }

        // 检查所有匹配的符号是否覆盖整个字符串
        const matchedLength = matches.reduce((total, match) => total + match.length, 0);
        
        // 如果字符验证失败，直接返回false
        if (matchedLength !== romanNumber.length) {
            return false;
        }

        // 4. 精确的组别模式验证：使用基于10种精确情况的组别正则表达式
        // 确保罗马数字符合正确的组别模式和语法规则
        return this.romanPreciseRegex.test(romanNumber);
    }

    /**
     * 罗马数字转阿拉伯数字
     * @param {string} romanNumber - 罗马数字字符串
     * @returns {number} 对应的阿拉伯数字
     */
    romanToArabic(romanNumber) {
        // 首先进行双重验证：字符验证 + 精确验证
        if (!this.#isRoman(romanNumber)) {
            return 0; // 验证失败返回0，表示无效
        }

        // 使用预编译的正则表达式一次性匹配所有可能的符号组合
        // 重置正则表达式的lastIndex，避免全局标志的影响
        this.romanSymbolRegex.lastIndex = 0;
        
        // 提取所有符号
        const symbols = romanNumber.match(this.romanSymbolRegex) || [];
        
        let result = 0;
        let prevValue = 0;

        // 从右向左遍历符号数组
        for (let i = symbols.length - 1; i >= 0; i--) {
            const currentSymbol = symbols[i];
            const currentValue = this.#getRomanValue(currentSymbol);

            // 如果当前值小于前一个值，说明是减法情况
            // 例如：IX 中 I(1) < X(10)，所以结果是 10 - 1 = 9
            if (currentValue < prevValue) {
                result -= currentValue;
            } else {
                result += currentValue;
            }

            // 更新前一个值
            prevValue = currentValue;
        }

        // 检查结果范围：确保在1-999999999之间
        if (result < 1 || result > 999999999) {
            return 0; // 超出范围返回0，表示无效
        }

        return result;
    }

}

// 创建实例并只导出公共方法
const romanConverter = new RomanConverter();

// 只导出两个公共方法
export const arabicToRoman = (arabicNumber) => romanConverter.arabicToRoman(arabicNumber);
export const romanToArabic = (romanNumber) => romanConverter.romanToArabic(romanNumber);

// 默认导出对象包含两个方法
export default {
    arabicToRoman,
    romanToArabic
};


