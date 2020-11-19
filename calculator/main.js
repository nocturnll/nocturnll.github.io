let output = document.getElementById("output");
let clear = document.getElementById("clear");
// let negative = document.getElementById("negative");
// let percent = document.getElementById("percent");
// let divide = document.getElementById("divide");
// let times = document.getElementById("times");
// let minus = document.getElementById("minus");
let plus = document.getElementById("plus");
let equals = document.getElementById("equals");
// let seven = document.getElementById("7");
// let eight = document.getElementById("8");
// let nine = document.getElementById("9");
// let zero = document.getElementById("zero");
// let one = document.getElementById("1");
// let two = document.getElementById("2");
// let three = document.getElementById("3");
// let four = document.getElementById("4");
// let five = document.getElementById("5");
// let six = document.getElementById("6");
// let dot = document.getElementById("dot");

let display = '';
let value = 0;
let previousValue = 0;
let lastFx;

function increaseInput(e) {
    display += e.target.innerHTML;
    value =+ parseInt(display);
    output.innerHTML = display;
}

document.querySelectorAll('.num').forEach(item => {
    item.addEventListener("click",increaseInput)
});

function add(e) {
    previousValue += value;
    console.log(previousValue)
    display = '';
    value = 0;
    lastFx = 'add';
}

plus.addEventListener("click", add)

function sum(e) {
    if (lastFx = 'add') {
        output.innerHTML = value + previousValue;
    }
}

equals.addEventListener("click", sum)

function reset(e) {
    display = '';
    value = 0;
    output.innerHTML = '0';
}

clear.addEventListener("click",reset)