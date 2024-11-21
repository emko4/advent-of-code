export const processData = (data: Buffer): number[] => {
    return data
        .toString()
        .split('\n')
        .map(Number)
        .reduce((acc, number, index, array) => {
            if (index <= 1) return acc;

            return [...acc, array[index - 2] + array[index - 1] + array[index]];
        }, []);
};

export const solution = (input: number[]): number => {
    return input.reduce((acc, number, index, array) => (array[index + 1] > number ? acc + 1 : acc), 0);
};
