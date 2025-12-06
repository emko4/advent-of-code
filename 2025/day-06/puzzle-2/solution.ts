type Problem = { numbers: number[]; operation: string };

export const processData = (data: Buffer): Problem[] => {
    const lines = data.toString().split('\n');

    const problems: Problem[] = [];

    const maxLineLength = Math.max(...lines.map((line) => line.length));
    const operations = lines.slice(-1)[0].split(/\s+/);

    let problem: Problem = { numbers: [], operation: '' };
    for (let i = 0; i < maxLineLength; i += 1) {
        let number = '';
        for (let j = 0; j < lines.length - 1; j += 1) {
            number += lines?.[j]?.[i] || '';
        }

        const isNumber = number.trim().length !== 0;

        // add number to problem
        if (isNumber) problem.numbers.push(Number(number));

        if (!isNumber || i === maxLineLength - 1) {
            // add operation
            problem.operation = operations[problems.length];
            // add complete problem to array
            problems.push(problem);
            // reset problem
            problem = { numbers: [], operation: '' };
        }
    }

    return problems;
};

export const solution = (input: Problem[]): number => {
    return input.reduce((acc, { numbers, operation }) => {
        if (operation === '+') {
            return acc + numbers.reduce((acc, number) => acc + number, 0);
        }

        if (operation === '*') {
            return acc + numbers.reduce((acc, number) => acc * number, 1);
        }

        return acc;
    }, 0);
};
