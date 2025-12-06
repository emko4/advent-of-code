type Problem = { numbers: number[]; operation: string };

export const processData = (data: Buffer): Problem[] => {
    const lines = data
        .toString()
        .split('\n')
        .map((line) => line.trim().split(/\s+/));

    const numbers = lines.slice(0, lines.length - 1);
    const operations = lines.slice(-1)[0];

    const transformedNumbers = Array(numbers[0].length)
        .fill(0)
        .map(() => Array(numbers.length).fill(0));

    for (let i = 0; i < numbers.length; i += 1) {
        for (let j = 0; j < numbers[0].length; j += 1) {
            transformedNumbers[j][i] = Number(numbers[i][j]);
        }
    }

    return transformedNumbers.map((numbers, index) => ({ numbers, operation: operations[index] }));
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
