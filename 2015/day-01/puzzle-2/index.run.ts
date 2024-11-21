const fs = require('fs');

const rawData = fs.readFileSync(__dirname + '/../input.txt');

export const processData = (data: Buffer): string => {
    return data.toString();
};

const processedInput = processData(rawData);

export const solution = (input: string): number => {
    let counter = 0;
    const index = input.split('').findIndex((char) => {
        if (char === '(') counter += 1;
        if (char === ')') counter -= 1;

        return counter < 0;
    });

    return index + 1;
};

console.time('Runtime');
const result = solution(processedInput);
console.timeEnd('Runtime');
console.log('Result: ', result);
