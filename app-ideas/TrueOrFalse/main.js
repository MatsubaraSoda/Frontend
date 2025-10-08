// Get DOM elements
const value1Input = document.getElementById('value1');
const type1Select = document.getElementById('type1');
const operatorSelect = document.getElementById('operator');
const value2Input = document.getElementById('value2');
const type2Select = document.getElementById('type2');
const compareBtn = document.getElementById('compareBtn');
const resultDiv = document.getElementById('result');
const messageDiv = document.getElementById('message');

// Convert input value to specified type
function convertValue(value, type) {
    if (value === '') {
        return { success: false, error: 'Value cannot be empty' };
    }

    switch (type) {
        case 'string':
            return { success: true, value: value };
        
        case 'number':
            const num = Number(value);
            if (isNaN(num)) {
                return { success: false, error: `"${value}" is not a valid number` };
            }
            return { success: true, value: num };
        
        case 'boolean':
            const lower = value.toLowerCase();
            if (lower === 'true') {
                return { success: true, value: true };
            } else if (lower === 'false') {
                return { success: true, value: false };
            } else {
                return { success: false, error: `"${value}" is not a valid boolean (use "true" or "false")` };
            }
        
        default:
            return { success: false, error: 'Invalid type' };
    }
}

// Perform comparison based on operator
function compare(val1, val2, operator) {
    switch (operator) {
        case '===':
            return val1 === val2;
        case '==':
            return val1 == val2;
        case '!==':
            return val1 !== val2;
        case '!=':
            return val1 != val2;
        case '<':
            return val1 < val2;
        case '>':
            return val1 > val2;
        case '<=':
            return val1 <= val2;
        case '>=':
            return val1 >= val2;
        default:
            return null;
    }
}

// Format value for display
function formatValueDisplay(value, type) {
    if (type === 'string') {
        return `"${value}"`;
    }
    return String(value);
}

// Generate message text
function generateMessage(rawValue1, type1, operator, rawValue2, type2, convertedValue1, convertedValue2) {
    const display1 = formatValueDisplay(rawValue1, type1);
    const display2 = formatValueDisplay(rawValue2, type2);
    return `${display1} (${type1}) ${operator} ${display2} (${type2})`;
}

// Handle compare button click
compareBtn.addEventListener('click', function() {
    // Get raw input values
    const rawValue1 = value1Input.value;
    const type1 = type1Select.value;
    const operator = operatorSelect.value;
    const rawValue2 = value2Input.value;
    const type2 = type2Select.value;

    // Convert values
    const result1 = convertValue(rawValue1, type1);
    const result2 = convertValue(rawValue2, type2);

    // Check for errors
    if (!result1.success) {
        resultDiv.textContent = '';
        resultDiv.className = 'result-value';
        messageDiv.textContent = `Error: ${result1.error}`;
        messageDiv.className = 'message-text error';
        return;
    }

    if (!result2.success) {
        resultDiv.textContent = '';
        resultDiv.className = 'result-value';
        messageDiv.textContent = `Error: ${result2.error}`;
        messageDiv.className = 'message-text error';
        return;
    }

    // Perform comparison
    const comparisonResult = compare(result1.value, result2.value, operator);

    if (comparisonResult === null) {
        resultDiv.textContent = '';
        resultDiv.className = 'result-value';
        messageDiv.textContent = 'Error: Invalid operator';
        messageDiv.className = 'message-text error';
        return;
    }

    // Display result
    resultDiv.textContent = comparisonResult ? 'TRUE' : 'FALSE';
    resultDiv.className = comparisonResult ? 'result-value true' : 'result-value false';

    // Display message
    const message = generateMessage(rawValue1, type1, operator, rawValue2, type2, result1.value, result2.value);
    messageDiv.textContent = message;
    messageDiv.className = 'message-text success';
});

