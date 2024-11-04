const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const input = data.toString();

const solution = (input: string): any => {
    console.log('Input: ', input);
    return 'Result';
}

console.time('Runtime');
const result = solution(input);
console.timeEnd('Runtime');
console.log('Result: ', result);