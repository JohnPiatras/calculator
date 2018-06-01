"use strict"

//Globals
let display_value = 0;
let display_stale = false;  //true if showing previous result - its gone stale, so clear and start again when  user presses a digit
let operands = [];
let operator = null;

updateDisplay();

let buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    if(button.textContent.match(/[0123456789]/g))
        button.addEventListener('click', onClickNumber);
    else if(button.textContent.match(/[*+-\/]/g)){
        button.addEventListener('click', onClickOperator);
    }else if(button.textContent == "="){
        button.addEventListener('click', onClickEquals);
    }else if(button.textContent == "AC"){
        button.addEventListener('click', onClickAllClear);
    }else if(button.textContent == "C"){
        button.addEventListener('click', onClickClear);
    }    
});

function onClickNumber(e){
    let num = Number(e.target.textContent);
    if(display_stale){
        display_value = 0;
        display_stale = false;
    }
    if( ("" + display_value).length < 15){
        display_value = (10 * display_value) + num;
        updateDisplay();
    }else {
        console.log("Digit limit reached");
    }
}

function onClickOperator(e){
    let op = e.target.textContent;
    
    if(!display_stale){
        operands.push(display_value);
        display_stale = true;
    }

    if(operands.length == 2){
        operands.push( operate());
        display_value = operands[0];
        display_stale = true;
    }
    operator = op;
    updateDisplay();
}

function onClickEquals(){
    if(operands.length == 1 && operator != null && !display_stale){
        operands.push(display_value);
        operands.push(operate());
        display_value = operands[0];
        operator = null;
        display_stale = true;
    } 

    updateDisplay();
}

function allClear(){
    display_value = 0;
    display_stale = false;
    operands = [];
    operator = null;
}

function onClickAllClear(){
    allClear();
    updateDisplay();
}

function onClickClear(){
    if(display_stale){
        allClear();
    }else
        display_value = Math.floor(display_value / 10);
    updateDisplay();
}

function updateDisplay(){
    document.getElementById("number-display").textContent = "" + display_value;
    document.getElementById("op-display").textContent = operator != null ? operator: "";
}

function printstate(){
    console.log("---State---");
    console.log("    operands: " + operands);
    console.log("    operator: " + operator);
    console.log("    display: " + display_value + ", stale: " + display_stale);
}




function operate(){
    let r;
    let a = operands.shift();
    let b = operands.shift();
    switch(operator){
        case '+':
            r = a + b;  
            break;
        case '-':
            r = a - b;
            break;
        case "*":
            r = a * b;
            break;
        case "/":
            r = a / b;
            break;
    }
    return r;
}

//implements a stack based calculator
let calculator = {
    precedence: {  "+": 1,
                    "-": 1,
                    "*": 2,
                    "/": 2
    },
    operand_stack: [],
    operator_stack: [],

    reset: function(){
        this.operand_stack = [];
        this.operator_stack = [];
    },


    //pop 2 operands and one operator, then evaluate
    evalTop: function(){
        let b = this.operand_stack.pop();
        let a = this.operand_stack.pop();
        let op = this.operator_stack.pop();
        let r = 0;
        switch(op){
            case '+':
                r = a + b;  
                break;
            case '-':
                r = a - b;
                break;
            case "*":
                r = a * b;
                break;
            case "/":
                r = a / b;
                break;
        }
        this.operand_stack.push(r);
    },

    pushOperator: function(op){
        if(this.operator_stack.length > 0 && this.precedence[op] <= this.precedence[this.operator_stack[this.operator_stack.length - 1]]){
            this.evalTop();
        }
        this.operator_stack.push(op);
    },

    push: function(value){
        let n = Number(value);
        if(!isNaN(n)){
            this.operand_stack.push(n);
        }
        else if(value.match(/[*+-\/]/g)){
            this.pushOperator(value);
        }
    },

    evalFromString: function(str){
        this.reset();
        let tokens = str.split(" ");
        while(tokens.length > 0){
            this.push(tokens.shift());
        }
        return this.evaluate();
    },

    evaluate: function(){
        while(this.operator_stack.length > 0){
            this.evalTop();
        }
        return this.operand_stack[0];
    },

    printState: function(){
        let arr = [];
        let n = (this.operand_stack.length >= this.operator_stack.length) ? this.operand_stack.length : this.operator_stack.length;
        for(let i = n - 1; i >= 0; i--){
            let a = " ";
            let b = " ";
            if(i < this.operand_stack.length){
                a = this.operand_stack[i];
            }

            if(i < this.operator_stack.length){
                b = this.operator_stack[i];
            }
            arr.push([a, b]);
        }
        console.table(arr);

    }


}



