/*
This file contains all the logic used in conversion of infix expression 
to postfix or prefix expression and evaluation of postfix expression
stacker class ::  is a stack maker
checker :: is for checking the expression is postfix or prefix
precedencer :: is for checking the precedence of the expression
*/


class stacker {

    constructor(size = 100) 
    {
        this.size = size;
        this.items = [];
        this.top = -1; // we can also use -> this.items.length
    }

    // Getters for stack below

    get lastIndex() {
        // this return the index of last item
        return this.top;
    }

    get stackLen() {
        return this.items.length;
    }

    get leftSize() {
        return this.size - this.stackLen;
    }

    get peek() {
        if (this.isEmpty() == true) {
            return null;
        } else {
            return this.items[this.top];
        }
    }

    // Setters for stack below

    getItem(index) {
        if (index > this.top || index < 0) {
            return null;
        } else {
            return this.items[index];
        }
    }

    // to check stack is full or not
    isFull() {
        if (this.top == this.size - 1) {
            return true;
        } else {
            return false;
        }
    }

    // to check stack is empty or not
    isEmpty() 
    {
        if (this.top < 0) 
        {
            return true;
        } else 
        {
            return false;
        }
    }

    // push for stack
    push(element) 
    {
        if (this.isFull() == true) 
        {
            return console.log("Stack is Full Now");
        } else 
        {
            this.top++;
            this.items[this.top] = element;
            return true;
        }

    }

    // pop for stack
    pop() 
    {
        var data;
        if (this.isEmpty() == true) 
        {
            return false;
        } else 
        {
            // data = this.items[this.top];
            // this.items[this.top] = undefined;
            // or we can use 
            data = this.items.splice(this.top, 1); // this will return an array with single element more efficient
            this.top--;
            return data[0];
        }
    }
    
    traverse() 
    {
        return this.items;
    }


}//End of Stack 

// INFIX TO POSTFIX

const preference = 
{
    "-": 0,
    "+": 0,
    "/": 1,
    "*": 1,
    "^": 2,
    ")": 3,
    "(": 3,
};

function precidencer(item) 
{
    /*
    precedence are :
            * > ^ > / > % > + > - > ) > ( > any operand
    */
    var operators = ['', '(', ')', '-', '+', '%', '/', '*', '^'];

    for (var j = 0; j < operators.length; j++) 
    {
        if (item == operators[j]) 
        {
            return j;
        }
    }

    return 0;
}

const isAnOperator = (s) => preference[s] !== undefined;
const isAParen = (s) => preference[s] === 3;

function infixToPostfixV2(expression, tab = 0) 
{
    console.log(expression);
}

// Infix to postfix conversion
function infixToPostfix(expression, tab = 0) 
{

    const infixExp = [...expression.split(""), ")"];
    const postfixExp = [];

    const stack = ["("];

    var table = {
        exp: [],
        stak: [],
        conexp: [],
    };

    table.exp.push("");
    table.stak.push(stack.join(" "));
    table.conexp.push(postfixExp.join(""));

    for (var char of infixExp) 
    {

        if (char === "(") 
        {
            stack.push(char);
            continue;
        } 
        else if (!isAnOperator(char)) 
        {
            postfixExp.push(char);
        } 
        else if (char === ")") 
        {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") 
            {
                const last = stack.pop();
                postfixExp.push(last);
            }
            stack.pop();
        } 
        else if (isAnOperator(char)) 
        {
            while (stack.length > 0 && preference[stack[stack.length - 1]] >= preference[char] && !isAParen(stack[stack.length - 1])) 
            {
                postfixExp.push(stack.pop());
            }

            stack.push(char);
        }

        if (tab == 1) 
        {
            table.exp.push(char);
            table.stak.push(stack.join(" "));
            table.conexp.push(postfixExp.join(""));
        }

    }

    while (stack.length > 0) 
    {
        postfixExp.push(stack.pop());
    }

    return {
        postfixExpression: postfixExp.join(""),
        table: table
    };
}

// reverser

function reverser(expression) 
{
    var _temp = expression.split("");

    for (var i = 0; i < expression.length; i++) 
    {
        if (_temp[i] === ')') 
        {
            _temp[i] = '(';
        } 
        else if (_temp[i] === '(') 
        {
            _temp[i] = ')';
        }
    }

    return _temp.reverse().join("");
}

function infixToPrefix(expression, tab = 0) 
{
    expression = infixToPostfix(reverser(expression), tab);
    return {
        prefixExpression: reverser(expression['postfixExpression']),
        table: expression['table']
    };
}

function isNumbers(expression) 
{

    let isNumber = true;

    const splited = expression.split(" ");

    for (const char of splited) 
    {
        if ("+-/*()^".includes(char)) continue;

        const num = parseInt(char);
        if (num.toString() === "NaN") 
        {
            isNumber = false;
            break;
        }
    }

    return isNumber;
}


function postfixEval(expression) 
{

    expression = expression.trim();

    const postfixExp = [...expression.split(" "), ")"];

    const isNumber = isNumbers(expression);

    const table = {
        char: [],
        s: [],
    };

    console.log(isNumber);

    const stack = [];
    let finalResult = 0;
    for (const char of postfixExp) 
    {

        if (char === ")") break;

        if (!isAnOperator(char)) 
        {
            stack.push(char);
        } 
        else 
        {
            const a = stack.pop();
            const b = stack.pop();

            let result = `(${b}${char}${a})`;


            stack.push(result);
        }

        finalResult = stack[stack.length - 1];

        table.char.push(char);
        table.s.push(stack.join(" "))
    }

    let _tresult = `${finalResult}`;

    if (isNumber) 
    {
        _tresult += ` = ${eval(finalResult)}`;
    }

    table.s[table.s.length - 1] = _tresult;

    return table;
}

function prefixEval(expression) 
{

    expression = expression.trim();

    const prefixExp = expression.split(" ");

    const stack = [];

    const table = {
        char: [],
        s: [],
    };

    for (const char of prefixExp.reverse()) 
    {
        if (!isAnOperator(char)) 
        {
            stack.push(char);
        } 
        else 
        {
            const a = stack.pop();
            const b = stack.pop();

            const result = `(${a}${char}${b})`;

            stack.push(result);
        }

        table.char.push(char);
        table.s.push(stack.join(" "));
    }

    // table.char = table.char.reverse();
    // table.s = table.s.reverse();

    const finalResult = table.s[table.s.length - 1];

    let _tresult = `${finalResult}`;

    if (isNumber) 
    {
        _tresult += ` = ${eval(finalResult)}`;
    }

    table.s[table.s.length - 1] = _tresult;

    return table;
}

function checker(expression) 
{
    if (precidencer(expression[0]) > 2) 
    {
        return 1;
    } 
    else 
    {
        return 0;
    }
}