const fs = require('fs');
require('dotenv').config();

// 1.
function compareTwoNums(num1, num2) {
    if (num1 % 2 === 0 && num2 % 2 === 0) {

        return false;
    }

    return true;
}

// 2.
shortCompare = (num1, num2) => (num1 % 2 == 0 && num2 % 2 == 0) ? false : true

// 3.
function sumArray(arr) {
    let sum = 0
    for (num of arr) {

        sum += num
    }

    return sum;
}


// console.log(sumArray([1, 2, 3, 4, 5, 10]))
// 4.
sumArray = arr => (arr.reduce((a, b) => a + b))