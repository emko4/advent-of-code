const fs = require('fs');

const data = fs.readFileSync(__dirname + '/input.txt' );

const input = data.toString().split('\n\n').map((elf) => elf.split('\n'));

const solution = (input: string[][]): number => {
    const elves = input.map((elf) => elf.reduce((acc, carriage) => acc + Number(carriage), 0));

    return elves.sort((a,b) => b - a).slice(0, 3).reduce((acc, carriage) => acc + carriage, 0);
}

console.time('Runtime');
const result = solution(input);
console.timeEnd('Runtime');
console.log('Result: ', result);