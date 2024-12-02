export const processData = (data: Buffer): number[][] => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split(' ').map(Number));
};

const isSafe = (input: number[]): boolean => {
    const isDecreasing = input.every((number, index) => {
        if (index === 0) return true;

        const differance = Math.abs(number - input[index - 1]);

        return number < input[index - 1] && differance >= 1 && differance <= 3;
    });

    const isIncreasing = input.every((number, index) => {
        if (index === 0) return true;

        const differance = Math.abs(number - input[index - 1]);

        return number > input[index - 1] && differance >= 1 && differance <= 3;
    });

    return isDecreasing || isIncreasing;
};

export const solution = (input: number[][]): number => {
    return input.reduce((acc, line) => {
        if (isSafe(line)) return acc + 1;

        const isSafeWithBadLevel = line.some((number, index) => {
            const lineWithoutLevel = line.filter((n, lIndex) => index !== lIndex);

            return isSafe(lineWithoutLevel);
        });

        return acc + (isSafeWithBadLevel ? 1 : 0);
    }, 0);
};
