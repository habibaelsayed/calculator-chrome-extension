let  buttons = document.getElementsByClassName('global');
let result = document.getElementById("result");



for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        if(buttons[i].value == "C") result.value = "";
        else if(buttons[i].value == "=") result.value = calculate(result.value);
        else if(buttons[i].value == "Del") result.value = result.value.slice(0, -1);
        else
        {
            let text = buttons[i].value;
            result.value += text;
        }
    });
}


let calculate = function(text) {
    let result = 0;
    let operators = [];
    let values = [];

    let precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2
    }

    let applyOperator = function() {
        let operator = operators.pop();
        let right = values.pop();
        let left = values.pop();

        switch (operator){
            case '+':
                values.push(left+right);
                break;
            case '-':
                values.push(left-right);
                break;
            case '*':
                values.push(left*right);
                break;
            case '/':
                values.push(left/right);
                break;
            case '%':
                values.push(left%right);
                break;
        }
    }

    for(let i = 0; i < text.length; i++){
        let token = text[i];
        if(token == ' ') continue;

        if(!isNaN(token)){

            let num = parseFloat(token);
            if(i == 1 && text[0] == '-')
            {
                operators.pop();
                num *= -1;
            }
            while(!isNaN(text[i+1]) && i+1 < text.length)
            {

                num = num * 10 + parseFloat(text[i+1]);
                i++;
            }
            if(text[i+1] == '.' && i+1 < text.length )
            {
                i++;
                let count = 1;
                while(!isNaN(text[i+1]) && i+1 < text.length){
                    num = num + parseFloat(text[i+1])/Math.pow(10, count++);
                    i++;
                }
            }
            values.push(num);
        }
        else if (token in precedence){
            let currPrecendence = precedence[token];
            while(operators.length > 0 && precedence[operators.length - 1] >= currPrecendence) {
                applyOperator();
            }
            operators.push(token);
        }
        else if (token == '(')
            operators.push(token)
        else if (token == ')') {
            while(operators[operators.length - 1] !== '(') applyOperator();
            operators.pop();
        }
    }
    
    while(operators.length > 0) applyOperator();

    if(values.length == 1) result = values[0];
    else result = "Error";

    return result;

    // try {
    //     const result = new Function('return ' + text)();
    //     return result;
    // } catch (error) {
    //     return 'Error';
    // }
}