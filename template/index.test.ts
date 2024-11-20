import fs from 'fs';

import { processData, solution } from './index.run';

const exampleData = fs.readFileSync(__dirname + '/inputExample.txt');
const exampleResult = fs.readFileSync(__dirname + '/inputExampleResult.txt');

describe('Puzzle <<puzzle>> from day <<day>> of the year <<year>>', () => {
    it('returns same result as AoC example result', () => {
        const input = processData(exampleData);
        const result = exampleResult.toString();

        expect(solution(input)).toStrictEqual(result);
    });
});
