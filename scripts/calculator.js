"use strict"

function initialise(){
    calculator.reset();
    display.clear();

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
                stale: false,
                update: function(){
                    document.getElementById("number-display").textContent = "" + this.number;
                    document.getElementById("op-display").textContent = this.operator != null ? this.operator: "";
                },
                clear: function(){
                    this.number = "0";
                    this.operator = null;
                    this.stale = false;
                    this.update();
                }
}

function onClickNumber(e){
    let num = e.target.textContent;
    if(display.stale){
        display.clear();     
    }
    if( display.number.length < 15){
        if(display.number == "0")
            display.number = num;
        else
            display.number = display.number + num;
        display.update();
    }else {
        console.log("Digit limit reached");
    }
}

function onClickPeriod(){
    if(!display.number.includes(".")){
        display.number = display.number + ".";
    }
    display.update();
}

function onClickOperator(e){
    let op = e.target.textContent;
    if(!display.stale){
        calculator.push(display.number);
        display.stale = true;
    }

    display.operator = op;
    calculator.push(op);
    display.update();
}

function onClickEquals(){
    if(!display.stale)calculator.push(display.number);
    display.number = "" + calculator.evaluate();
    display.stale = true;
    display.operator = null;
    display.update();
}


function onClickAllClear(){
    display.clear();
    calculator.reset();
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
        this.printState();
        //this.toString();
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