const fs = require('fs');

const rawData = fs.readFileSync(__dirname + '/../input.txt');

export const processData = (data: Buffer): string => {
    return data.toString();
};

const processedInput = processData(rawData);

export const solution = (input: string): number => {
    const { left, right } = input.split('').reduce(
        ({ left, right }, char) => ({
            left: char === '(' ? left + 1 : left,
            right: char === ')' ? right + 1 : right,
        }),
        { left: 0, right: 0 },
    );

    return left - right;
};

console.time('Runtime');
const result = solution(processedInput);
console.timeEnd('Runtime');
console.log('Result: ', result);
