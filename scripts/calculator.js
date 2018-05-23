"use strict"

let buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener('click', onClick);

});

function onClick(e){
    console.log("Button = " + e.target.textContent);
    let button_txt = e.target.textContent;
    let num = Number(button_txt);

    if(!isNaN(num)){
        console.log(" a number!");
        onNumberClick(num);
    }
}

let display_value = 0;
updateDisplay();

//limit to 15 digits?
function onNumberClick(num){
    if( ("" + display_value).length < 15){
        display_value = (10 * display_value) + num;
        console.log("Current display value = " + display_value);
        updateDisplay();
    }else {
        console.log("Digit limit reached");
    }
}

function updateDisplay(){
    document.getElementById("number-display").textContent = "" + display_value;

}

let calculator = {
    operands: [],
    operator: null,

    operate: function(a, b, op){
        let r;
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
        return r;
    }



}


