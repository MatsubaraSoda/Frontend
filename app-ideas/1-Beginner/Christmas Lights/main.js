/*
当 HTML 文档完全解析，
且所有延迟脚本（<script defer src="…"> 
和 <script type="module">）下载和执行完毕后，
会触发 DOMContentLoaded 事件。
它不会等待图片、子框架和异步脚本等其他内容完成加载。
*/
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const form = document.getElementById("myForm");

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    startBtn.addEventListener("click", () => {
        const interval = parseFloat(form.interval.value);
        const minIntensity = parseFloat(form.minIntensity.value);
        const maxIntensity = parseFloat(form.maxIntensity.value);
        const size = parseFloat(form.size.value);
        const rows = parseInt(form.rows.value, 10);

        console.log('interval:', interval);
        console.log('minIntensity:', minIntensity);
        console.log('maxIntensity:', maxIntensity);
        console.log('size:', size);
        console.log('rows:', rows);

        // 圣诞灯效果设置
        // 行数
        const container = document.querySelector('.container-lights');
        while (container.children.length > 1) {
            container.removeChild(container.lastElementChild);
        }
        if (rows >= 2 && rows <= 7) {
            for (let r = 1; r < rows; r++) {
                const row = document.createElement('div');
                row.className = 'row-lights';
                for (let i = 1; i <= 7; i++) {
                    const light = document.createElement('div');
                    light.className = `lights-${i} lights`;
                    light.setAttribute('data-anima', `lights-anima-${i}`);
                    row.appendChild(light);
                }
                container.appendChild(row);
            }
        }
        // 灯泡尺寸 // 要放在行数后面
        const elements = document.getElementsByClassName("row-lights");
        for (let el of elements) {
            el.style.height = `${size}px`;
            el.style.width = `${size * 7 + 120}px`; // 7个灯泡 + 20px 间距 * 6
        }
        // 时间间隔以及开灯 // 开灯逻辑要放在其他设置的后面
        for (let i = 1; i <= 7; i++) {
            let els = document.querySelectorAll(`[data-anima="lights-anima-${i}"]`);
            for (let el of els) {
                el.style.animationDuration = interval + 's';     
                el.classList.remove(`lights-anima-${i}`); // 先移除
                void el.offsetWidth; // 强制重绘，确保动画重启（可选但更保险）           
                el.classList.add(`lights-anima-${i}`); // 开灯
            }
        }        
    });

    stopBtn.addEventListener("click", () => {

        for (let i = 1; i <= 7; i++) {
            let els = document.querySelectorAll(`[data-anima="lights-anima-${i}"]`);
            for (let el of els) {
                el.classList.remove(`lights-anima-${i}`);
            }
        }
    })
});
