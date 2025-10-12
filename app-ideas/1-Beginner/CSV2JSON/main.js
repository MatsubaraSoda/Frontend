// 获取 DOM 元素
// json 面板
const inputImportJson = document.getElementById("inputImportJson");
const btnImportJson = document.getElementById("btnImportJson");
const btnExportJson = document.getElementById("btnExportJson");
const btnClearJson = document.getElementById("btnClearJson");
const jsonTextArea = document.getElementById("jsonTextArea");
// csv 面板
const inputImportCsv = document.getElementById("inputImportCsv");
const btnImportCsv = document.getElementById("btnImportCsv");
const btnExportCsv = document.getElementById("btnExportCsv");
const btnClearCsv = document.getElementById("btnClearCsv");
const csvTextArea = document.getElementById("csvTextArea");
// 转换面板
const btnConvertJsonToCsv = document.getElementById("btnConvertJsonToCsv");
const btnConvertCsvToJson = document.getElementById("btnConvertCsvToJson");
// 日志信息
const logList = document.getElementById("logList");

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  addLog("Page loaded successfully.");
});

function setupEventListeners() {
  // json 面板
  // 导入
  btnImportJson.addEventListener("click", () => {
    importJson();
  });
  // 导出
  btnExportJson.addEventListener("click", () => {
    exportJson();
  });
  // 清空
  btnClearJson.addEventListener("click", () => {
    jsonTextArea.value = "";
    addLog("Clear JSON text successfully.");
  });

  // csv 面板
  // 导入
  btnImportCsv.addEventListener("click", () => {
    importCsv();
  });
  // 导出
  btnExportCsv.addEventListener("click", () => {
    exportCsv();
  });
  // 清空
  btnClearCsv.addEventListener("click", () => {
    csvTextArea.value = "";
    addLog("Clear CSV text successfully.");
  });

  // 转换
  btnConvertJsonToCsv.addEventListener("click", () => {
    convertJsonToCsv();
  });
  btnConvertCsvToJson.addEventListener("click", () => {
    convertCsvToJson();
  });
}

function importJson() {
  inputImportJson.click();
  inputImportJson.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      jsonTextArea.value = e.target.result;
      addLog("Import JSON file successfully.");
    };
    reader.onerror = (e) => {
      addLog("Error reading JSON file: " + e);
    };
    reader.readAsText(file);
  });
}

function importCsv() {
  inputImportCsv.click();
  inputImportCsv.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      csvTextArea.value = e.target.result;
      addLog("Import CSV file successfully.");
    };
    reader.onerror = (e) => {
      addLog("Error reading CSV file: " + e);
    };
    reader.readAsText(file);
  });
}

function exportJson() {
  const json = jsonTextArea.value;
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.json";
  a.click();
  addLog("Export JSON file successfully.");
}

function exportCsv() {
  const csv = csvTextArea.value;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.csv";
  a.click();
  addLog("Export CSV file successfully.");
}

function convertJsonToCsv() {
  try {
    const json = JSON.parse(jsonTextArea.value);
    const csv = Papa.unparse(json);
    csvTextArea.value = csv;
    addLog("Convert JSON to CSV successfully.");
  } catch (error) {
    addLog("Error converting JSON to CSV: " + error.message, true);
    console.error("JSON to CSV conversion error:", error);
  }
}

function convertCsvToJson() {
  try {
    const csv = csvTextArea.value;
    const result = Papa.parse(csv, { header: true });
    
    if (result.errors && result.errors.length > 0) {
      addLog("CSV parsing warnings: " + result.errors.map(e => e.message).join(", "));
    }
    
    const json = result.data;
    jsonTextArea.value = JSON.stringify(json, null, 2);
    addLog("Convert CSV to JSON successfully.");
  } catch (error) {
    addLog("Error converting CSV to JSON: " + error.message, true);
    console.error("CSV to JSON conversion error:", error);
  }
}

function addLog(message, isError = false) {
  // 创建一个 li 元素。其中有两个 span 元素。
  // 第一个 span 元素的 class 为 "log-time"，
  // 第二个 span 元素的 class 为 "log-message"。
  const li = document.createElement("li");
  const timeSpan = document.createElement("span");
  timeSpan.className = "log-time";
  timeSpan.textContent = "[" + new Date().toLocaleString() + "]";
  const messageSpan = document.createElement("span");
  messageSpan.className = "log-message";
  messageSpan.textContent = message;
  
  // 如果是错误信息，添加错误样式
  if (isError) {
    li.className = "log-error";
    messageSpan.style.color = "#ff6b6b";
    messageSpan.style.fontWeight = "bold";
  }
  
  li.appendChild(timeSpan);
  li.appendChild(messageSpan);
  logList.appendChild(li);
  
  // 自动滚动到最新日志
  const logPanel = logList.parentElement;
  logPanel.scrollTop = logPanel.scrollHeight;
}
