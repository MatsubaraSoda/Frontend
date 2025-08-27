// number
for (let i = 0; i <= 9; i++) {
    document.getElementById("num" + i).addEventListener('click', () => numClick(i));
}
document.addEventListener('keydown', function (e) {
    // e.key 匹配主键盘和小键盘的数字
    if (e.key >= '0' && e.key <= '9') {
        numClick(Number(e.key));
    }
});

// dot
document.getElementById("dot").addEventListener('click', () => dotClick('.'));
document.addEventListener('keydown', function (e) {
    if (e.key === '.') {
        dotClick('.');
    }
});

// operator
document.getElementById("add").addEventListener('click', () => operatorClick('+'));
document.getElementById("subtract").addEventListener('click', () => operatorClick('-'));
document.getElementById("multiply").addEventListener('click', () => operatorClick('*'));
document.getElementById("divide").addEventListener('click', () => operatorClick('/'));
document.getElementById("equals").addEventListener('click', () => operatorClick('='));
document.getElementById("clear").addEventListener('click', () => operatorClick('C'));
document.getElementById("backspace").addEventListener('click', () => operatorClick('←'));
// operator keyboard support
document.addEventListener('keydown', function (e) {
    if (['+', '-', '*', '/'].includes(e.key)) {
        operatorClick(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        operatorClick('=');
    } else if (e.key === 'Backspace') {
        operatorClick('←');
    } else if (e.key.toLowerCase() === 'c') {
        operatorClick('C');
    }
});

let intPart = "0";
let dotPart = false;
let decPart = "";
if (dotPart) {
    number2 = intPart + "." + decPart;
}
else {
    number2 = intPart;
}
document.querySelector('#display span').innerText = number2;
let number1 = "";
let result = "";
let operator = "";

function numClick(num) {

    if (!dotPart) {
        if (intPart.length >= 8) {
            return;
        }
        if (intPart === "0") {
            intPart = String(num);
        } else {
            intPart += String(num);
        }
        number2 = intPart;
    }
    else {
        if (decPart.length >= 3) {
            return;
        }
        decPart += String(num);
        number2 = intPart + "." + decPart;
    }

    showNumber2();
}

function dotClick() {

    if (dotPart) {
        return;
    }

    dotPart = true;
    number2 += '.';

    showNumber2();
}

function operatorClick(op) {
    if (op === '=') {
        showResult();
        return;
    }

    if (op === 'C') {
        intPart = "0";
        dotPart = false;
        decPart = "";
        number2 = intPart;
        number1 = "";
        result = "";
        operator = "";

        showNumber2();
    }
    else if (op === '←') {
        if (number2 === "0") { return; }
        else if (number2 === "ERR") { return; }
        else if (!dotPart) {
            if (intPart.length === 1) {
                intPart = "0";
            } else {
                intPart = intPart.slice(0, -1);
            }
            number2 = intPart;
        }
        else if (number2.endsWith('.')) {
            dotPart = false;
            number2 = intPart;
        }
        else {
            decPart = decPart.slice(0, -1);
            number2 = intPart + "." + decPart;
        }

        showNumber2();
    }

    if (op === '+' || op === '-' || op === '*' || op === '/') {
        operator = op;
        number1 = number2;
        intPart = "0";
        dotPart = false;
        decPart = "";
        number2 = intPart;
    }

}

function showNumber2() {
    console.log("number1:", number1);
    console.log("number2:", number2);
    document.querySelector('#display span').innerText = number2;
}

function showResult() {
    if (operator === "+") { result = String(Number(number1) + Number(number2)); }
    if (operator === "-") { result = String(Number(number1) - Number(number2)); }
    if (operator === "*") { result = String(Number(number1) * Number(number2)); }
    if (operator === "/" && number2 !== "0") { result = String(Number(number1) / Number(number2)); }


    const regExp = /^\d{1,8}(\.\d{1,3})?$/;
    if (!regExp.test(result)) {
        result = "ERR";
    }
    if (operator === "/" && number2 === "0") {
        result = "ERR";
    }

    document.querySelector('#display span').innerText = result;
    operator = "";
    result = "";
    number2 = result;

    console.log("number1:", number1);
    console.log("number2:", number2);

}
