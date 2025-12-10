import fs from 'fs';

import { processData, solution } from './solution';

const rawData = fs.readFileSync(__dirname + '/../input.txt');

const processedInput = processData(rawData);

console.time('Runtime');
const result = await solution(processedInput);
console.timeEnd('Runtime');
console.log('Result: ', result);
