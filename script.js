// --- BASIC MATH FUNCTIONS ---
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) return "Snarky Error"; // Snarky error handling
    return a / b;
};

// --- STATE VARIABLES ---
let firstNumber = '';
let secondNumber = '';
let currentOperator = null;
let shouldResetDisplay = false; // Helps us know when to clear display after an operator

const display = document.getElementById('display');

// --- OPERATE FUNCTION ---
function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        default: return null;
    }
}

// --- DISPLAY LOGIC ---
function resetScreen() {
    display.textContent = '';
    shouldResetDisplay = false;
}

function appendNumber(number) {
    if (display.textContent === '0' || shouldResetDisplay) {
        resetScreen();
    }
    display.textContent += number;
}

function appendPoint() {
    if (shouldResetDisplay) resetScreen();
    if (display.textContent === '') display.textContent = '0';
    // Prevent multiple decimals
    if (display.textContent.includes('.')) return;
    display.textContent += '.';
}

function deleteNumber() {
    display.textContent = display.textContent.toString().slice(0, -1);
    if (display.textContent === '') display.textContent = '0';
}

function clearCalculator() {
    display.textContent = '0';
    firstNumber = '';
    secondNumber = '';
    currentOperator = null;
    shouldResetDisplay = false;
}

// --- CORE CALCULATOR LOGIC ---
function setOperation(operator) {
    if (currentOperator !== null) {
        // GOTCHA: If operator already exists, calculate immediately!
        // This handles "12 + 7 - 1" logic.
        if (!shouldResetDisplay) { // Only calculate if user actually typed a second number
            evaluate(); 
        }
    }
    firstNumber = display.textContent;
    currentOperator = operator;
    shouldResetDisplay = true; // Next number typed should clear screen
}

function evaluate() {
    if (currentOperator === null || shouldResetDisplay) return;
    if (currentOperator === '/' && display.textContent === '0') {
        display.textContent = "Nice try, pal!"; // Snarky message
        setTimeout(clearCalculator, 2000); // Reset after 2 seconds
        return;
    }

    secondNumber = display.textContent;
    let result = operate(currentOperator, firstNumber, secondNumber);
    
    // Rounding logic to avoid overflow (max 3 decimals)
    if (typeof result === 'number') {
        display.textContent = Math.round(result * 1000) / 1000;
    } else {
        display.textContent = result;
    }
    
    currentOperator = null;
}

// --- EVENT LISTENERS (CLICK) ---
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const backspaceButton = document.getElementById('backspace');
const decimalButton = document.getElementById('decimal');

numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (button.textContent === '.') return; // Handled separately
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener('click', () => setOperation(button.getAttribute('data-key')));
});

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clearCalculator);
backspaceButton.addEventListener('click', deleteNumber);
decimalButton.addEventListener('click', appendPoint);

// --- KEYBOARD SUPPORT ---
window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendPoint();
    if (e.key === '=' || e.key === 'Enter') evaluate();
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearCalculator();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        setOperation(e.key);
    }
}