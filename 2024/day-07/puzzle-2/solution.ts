type Input = { result: number; numbers: number[] }[];

export const processData = (data: Buffer): Input => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            const [result, numbers] = line.split(': ');

            return { result: Number(result), numbers: numbers.split(' ').map(Number) };
        });
};

const recursion = (result: number, numbers: number[], index: number): boolean => {
    if (index === numbers.length) {
        return numbers[index - 1] === result;
    }

    if (numbers[index] >= result) return false;

    const addition = [...numbers];
    const multiplication = [...numbers];
    const concatenation = [...numbers];

    addition[index] = addition[index - 1] + addition[index];
    multiplication[index] = multiplication[index - 1] * multiplication[index];
    concatenation[index] = Number('' + concatenation[index - 1] + concatenation[index]);

    const resultAdd = recursion(result, addition, index + 1);
    const resultMul = recursion(result, multiplication, index + 1);
    const resultCon = recursion(result, concatenation, index + 1);

    return resultAdd || resultMul || resultCon;
};

export const solution = (input: Input): number => {
    return input.reduce((acc, { result, numbers }) => {
        const isOk = recursion(result, numbers, 1);
        return acc + (isOk ? result : 0);
    }, 0);
};
