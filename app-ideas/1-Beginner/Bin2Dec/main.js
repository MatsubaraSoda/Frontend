document.getElementById("input-binary").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { convertBinaryToDecimal(); }
})

document.getElementById("btn-convert").addEventListener("click", convertBinaryToDecimal);

function convertBinaryToDecimal() {
    let numBinary = document.getElementById("input-binary").value;

    if (qBinary(numBinary)) {
        numDecimal = parseInt(numBinary, 2);
        document.getElementById("output-decimal").innerHTML = numDecimal;
    }
    else {
        document.getElementById("output-decimal").innerHTML = "Invalid input. Enter 0 or 1.";
    }
}

function qBinary(x) {
    return /^[01]+$/.test(x);
}