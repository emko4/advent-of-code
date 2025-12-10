import fs from 'fs';

import { processData, solution } from './solution';

const exampleData = fs.readFileSync(__dirname + '/example-input.txt');
const exampleResult = fs.readFileSync(__dirname + '/example-result.txt');

describe('Puzzle 2 from day 10 of the year 2025', () => {
    it('returns same result as AoC example result', async () => {
        const input = processData(exampleData);
        const result = exampleResult.toString();

        const expected = (await solution(input)).toString();

        expect(expected).toStrictEqual(result);
    });
});
