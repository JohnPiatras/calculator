"use strict"

function initialise(){
    calculator.reset();
    display.clear();

    window.addEventListener('keypress', onKeyPress);

    let buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        if(button.textContent.match(/[0123456789]/g))
            button.addEventListener('click', onClickNumber);
        else if(button.textContent.match(/[*\+\-\/]/g)){
            button.addEventListener('click', onClickOperator);
        }else if(button.textContent == "="){
            button.addEventListener('click', onClickEquals);
        }else if(button.textContent == "AC"){
            button.addEventListener('click', onClickAllClear);
        }else if(button.textContent == "C"){
            button.addEventListener('click', onClickClear);
        }else if(button.textContent == "."){
            button.addEventListener('click', onClickPeriod); 
        }  
    });
}

let display = { number: "0",
                operator: null,
                stale: false, //indicates that current value of display.number should not be pushed to calculator
                update: function(){
                    document.getElementById("number-display").textContent = "" + this.number;
                    document.getElementById("op-display").textContent = this.operator != null ? this.operator: "";
                },
                clear: function(){
                    this.number = "0";
                    this.operator = null;
                    this.stale = false;
                    this.update();
                },
                clearNumber: function(){
                    this.number = "";
                    this.stale = false;
                },
                setNumber: function(n){
                    let s = "" + n;
                    
                    if(s.length > 15){
                        s = n.toPrecision(15);

                        let e = s.indexOf("e+");
                        if(e > -1)
                            //s = n.toPrecision(15 - (s.length - e + 1));
                            s = n.toPrecision(14 - s.length + e);
                        else if(s.indexOf(".") > -1)
                            s = n.toPrecision(14);
                    }

                    this.number = s;
                    
                }
}

function onKeyPress(e){
    switch(e.charCode){
        case 0:
            if(e.keyCode == 13)onClickEquals();
            switch(e.keyCode){
                case 8:
                    onClickClear();
                    break;
                case 13:
                    onClickEquals();
                    break;
            }
            break;
        case 42:
            onClickOperator({target: {textContent: "*" }} );
            break;
        case 43:
            onClickOperator({target: {textContent: "+" }} );
            break;
        case 45:
            onClickOperator({target: {textContent: "-" }} );
            break;
        case 46:
            onClickPeriod();
            break;
        case 47:
            onClickOperator({target: {textContent: "/" }} );
            break;
        
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            onClickNumber({target: {textContent: String.fromCharCode(e.charCode) }} );


    }
    console.log(e.charCode + " : " + e.keyCode);
}

function onClickNumber(e){
    let num = e.target.textContent;
    if(display.stale){
        display.number = "";
        display.stale = false;     
    }
    if( display.number.length < 15){
        if(display.number == "0" || display.number == "")
            display.number = num;
        else
            display.number = display.number + num;
        display.update();
    }
}

function onClickPeriod(){
    if(!display.number.includes(".")){
        if(!display.stale)
            display.number = display.number + ".";
        else{
            display.number = "0.";
            display.stale = false;
        }
    }
    display.update();
}

function onClickOperator(e){
    let op = e.target.textContent;

    if(!display.stale){
        calculator.push(display.number);
    }
    display.number = "";
    display.stale = true;
    display.operator = op;
    calculator.push(op);
    display.update();
}

function onClickEquals(){
    if(display.number == "0" && display.operator == "/"){
        alert("Warning - singlularity detected! Please don't divide by zero!");
        return;
    }

    if(!display.stale){
        calculator.push(display.number);
        display.setNumber(calculator.evaluate());
        display.stale = true;
        display.operator = null;
        display.update();
    }
}


function onClickAllClear(){
    if(confirm("Are you sure you wish to Clear All?")){
        display.clear();
        calculator.reset();
    }
}

function onClickClear(){
    if(display.stale){
        onClickAllClear();
    }else
        display.number = display.number.slice(0, display.number.length - 1);
    display.update();
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
        if(this.operator_stack.length > 0 ){
            if(this.operand_stack.length <= this.operator_stack.length)
                this.operator_stack.pop();//replace current operator

            if(this.precedence[op] <= this.precedence[this.operator_stack[this.operator_stack.length - 1]]){
                this.evalTop();
            }
        }
        this.operator_stack.push(op);
    },

    pushNumber: function(n){
        if(this.operand_stack.length > this.operator_stack.length)
            this.operand_stack.pop(); //replace current operand
        this.operand_stack.push(n);
    },

    push: function(value){
        let n = Number(value);
        if(!isNaN(n)){
            
            this.pushNumber(n);
        }
        else if(value.match(/[*+-\/]/g)){
            this.pushOperator(value);
        }
    },

    peekOperand: function(){
        return this.operand_stack[this.operand_stack.length - 1];
    },

    peekOperator: function(){
        return this.operator_stack[this.operator_stack.length - 1];
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

    },

    toString: function(){
        let s = "";
        let nums = [...this.operand_stack];
        let ops = [...this.operator_stack];
        while(nums > 0 || ops > 0){
            s = s + " " + nums.shift() + " " + ops.shift();
        }
        console.log(s);
        return s;
    }


}


initialise();