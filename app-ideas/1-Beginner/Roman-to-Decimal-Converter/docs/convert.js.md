# Convert.js 使用说明

## 基本用法

```javascript
import { arabicToRoman, romanToArabic } from './convert.js';

// 阿拉伯数字 → 罗马数字
console.log(arabicToRoman(1));        // "I"
console.log(arabicToRoman(4));        // "IV"  
console.log(arabicToRoman(4000));     // "MV̅"
console.log(arabicToRoman(999999999)); // "C̅̅M̅̅X̅̅C̅̅M̅X̅̅C̅M̅X̅C̅MX̅CMXCIX"

// 罗马数字 → 阿拉伯数字
console.log(romanToArabic("I"));      // 1
console.log(romanToArabic("IV"));     // 4
console.log(romanToArabic("MV̅"));     // 4000
```

## 支持的符号

- **基础**: I(1), V(5), X(10), L(50), C(100), D(500), M(1000)
- **单横线**: V̅(5000), X̅(10000), L̅(50000), C̅(100000), D̅(500000), M̅(1000000)  
- **双横线**: V̅̅(5000000), X̅̅(10000000), L̅̅(50000000), C̅̅(100000000), D̅̅(500000000), M̅̅(1000000000)

## 范围

- **支持范围**: 1 - 999,999,999
- **无效输入**: 返回空字符串 `''` 或 `0`

## 测试

```bash
node -e "import('./convert.js').then(m => console.log(m.arabicToRoman(123)))"
```
