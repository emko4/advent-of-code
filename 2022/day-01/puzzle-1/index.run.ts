const fs = require('fs');

const rawData = fs.readFileSync(__dirname + '/../input.txt');

export const processData = (data: Buffer): string[][] => {
    return data
        .toString()
        .split('\n\n')
        .map((elf) => elf.split('\n'));
};

const processedInput = processData(rawData);

export const solution = (input: string[][]): number => {
    return Math.max(...input.map((elf) => elf.reduce((acc, carriage) => acc + Number(carriage), 0)));
};

console.time('Runtime');
const result = solution(processedInput);
console.timeEnd('Runtime');
console.log('Result: ', result);
