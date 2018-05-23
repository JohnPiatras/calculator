"use strict"

function add(a, b) {
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    return a / b;
}

function operate(a, b, op){
    let r;
    switch(op){
        case '+':
            r = add(a, b);  
            break;
        case '-':
            r = subtract(a, b);
            break;
        case "*":
            r = multiply(a, b);
            break;
        case "/":
            r = divide(a, b);
            break;
    }

    return r;

}
