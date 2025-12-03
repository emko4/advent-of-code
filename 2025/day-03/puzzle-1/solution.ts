export const processData = (data: Buffer): number[][] => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('').map(Number));
};

export const solution = (input: number[][]): number => {
    return input.reduce((acc, line) => {
        const lineWithoutLast = line.slice(0, line.length - 1);
        const firstMax = Math.max(...lineWithoutLast);
        const firstIndex = line.slice(0, line.length - 1).findIndex((number) => number === firstMax);
        const secondMax = Math.max(...line.slice(firstIndex + 1));

        return acc + Number('' + firstMax + secondMax);
    }, 0);
};
