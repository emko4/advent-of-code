const fs = require('fs');

const rawData = fs.readFileSync(__dirname + '/input.txt');

export const processData = (data: Buffer): any => {
    return data.toString();
};

const processedInput = processData(rawData);

export const solution = (input: string): any => {
    console.log('Input: ', input);
    return 'Result';
};

console.time('Runtime');
const result = solution(processedInput);
console.timeEnd('Runtime');
console.log('Result: ', result);
