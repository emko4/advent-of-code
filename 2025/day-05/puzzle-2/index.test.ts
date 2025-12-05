import fs from 'fs';

import { processData, solution } from './solution';

const exampleData = fs.readFileSync(__dirname + '/example-input.txt');
const exampleResult = fs.readFileSync(__dirname + '/example-result.txt');

describe('Puzzle 2 from day 05 of the year 2025', () => {
    it('returns same result as AoC example result', () => {
        const input = processData(exampleData);
        const result = exampleResult.toString();

        expect(solution(input).toString()).toStrictEqual(result);
    });
});
