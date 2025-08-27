# Note

## 通过类选择器查询标签的默认样式

```js
const element = document.querySelector('.navbar');
const value = window.getComputedStyle(element).backgroundColor;
console.log(value);
```

## 标签默认样式

### 通用

`background-color: rgba(0, 0, 0, 0);`
`background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;`

`border: 0px none rgb(0, 0, 0);`


### body

查询方法：

```js
console.log(getComputedStyle(document.body).backgroundColor);
```

```css
{
    display: block;
    position: static;
    margin: 8px;
    padding: 0px;    
}
```

### div

```css
{
    display: block;    
    position: static;
    margin: 0px;
    padding: 0px;

    /* display: flex; */
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: normal;
    gap: norml; /* 调整子元素之间的间隔 */
    align-items: norml; /* ? 通常和 height: 100%; 一起使用 */

    white-space: normal; /* 对 display 的值没有要求 */
}
```

### p

```css
{
    display: block;    
    position: static;
    margin: 16px 0px;
    padding: 0px;
}
```

### span

```css
{
    display: inline; 
    position: static;
    margin: 0px;
    padding: 0px;
}
```

### ul

```css
{
    display: block;    
    position: static;
    margin: 16px 0px;
    padding: 0px 0px 0px 40px; /*  */

    list-style-type: disc; /* 	Sets the list item marker to a bullet (default) */
}
```

### li

```css
{
    display: list-item;    
    position: static;
    margin: 0px;
    padding: 0px;    
}
```

### a

```css
{
    display: inline;
    position: static;
    margin: 0px;
    padding: 0px;

    /* 拥有 href="#" 属性则 */
    text-decoration: underline solid rgb(0, 0, 238);
}
```

### svg

```css
{
    display: inline;
    position: static;
    margin: 0px;
    padding: 0px;
}
```

### path

```css
{
    display: inline;
    position: static;
    margin: 0px;
    padding: 0px;
}
```

### img

```css
{
    display: inline;
    position: static;
    margin: 0px;
    padding: 0px;
}
```

### form

```css
{
    display: block;
    position: static;
    margin: 0px;
    padding: 0px;
}
```

### input

```css
{
    display: inline-block;
    position: static;
    margin: 0px;
    padding: 1px 2px;
}
```