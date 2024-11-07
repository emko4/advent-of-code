const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt');

const input = data.toString();

const solution = (input: string): number => {
    let counter = 0;
    const index = input.split('').findIndex((char) => {
        if (char === '(') counter += 1;
        if (char === ')') counter -= 1;

        return counter < 0;
    });

    return index + 1;
};

console.time('Runtime');
const result = solution(input);
console.timeEnd('Runtime');
console.log('Result: ', result);
