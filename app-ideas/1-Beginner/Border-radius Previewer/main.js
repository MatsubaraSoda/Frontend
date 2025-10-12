var previewer = document.getElementById("previewer");
previewer.style.border = "1px solid";
previewer.style.width = "200px";
previewer.style.height = "100px";
previewer.style.backgroundColor = "gray";
previewer.style.borderRadius = "0px";

// console.log(previewer)

document.getElementById("tl").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { styleChange(); }
})
document.getElementById("tr").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { styleChange(); }
})
document.getElementById("bl").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { styleChange(); }
})
document.getElementById("br").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { styleChange(); }
})

function styleChange() {
    tl = document.getElementById("tl").value;
    tr = document.getElementById("tr").value;
    bl = document.getElementById("bl").value;
    br = document.getElementById("br").value;
    document.querySelector("#invalid span").innerHTML = "";

    const numReg = /^[0-9]+$/

    if (numReg.test(tl) && numReg.test(tr) && numReg.test(bl) && numReg.test(br)) {
        previewer.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
    }
    else {
        document.querySelector("#invalid span").innerHTML = "Invalid Input!";
        document.querySelector("#invalid span").style.color = "red";
        document.querySelector("#invalid").style.marginTop = "20px";
    }

    // console.log("Check:")
    // console.log(previewer.style.borderRadius)
    // console.log(`border-radius: ${previewer.style.borderRadius}`)
}

function copyBorderRadius() {
    const copyText = `border-radius: ${previewer.style.borderRadius}`;

    navigator.clipboard.writeText(copyText);

    alert("Copied the text: " + copyText);
}