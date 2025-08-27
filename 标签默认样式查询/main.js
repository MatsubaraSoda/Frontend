document.getElementById('tag-check').addEventListener('click', showTagStyle);

document.getElementById('tag-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        showTagStyle();
    }
});

function showTagStyle() {
    const tagName = document.getElementById('tag-input').value;
    const properties = ['display', 'position', 'margin', 'padding'];
    let values = [];

    const tempElement = document.createElement(tagName);
    document.body.appendChild(tempElement); 

    const computedStyle = window.getComputedStyle(tempElement);
    for (let prop of properties) {
        values.push(`${prop}: ${computedStyle[prop]};`);
    }
    document.body.removeChild(tempElement);

    document.getElementById('result').innerText = `${tagName}:\n{\n${values.join('\n')}\n}`;

    console.log(values);

    


}