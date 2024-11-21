export const processData = (data: Buffer): number[] => {
    return data.toString().split('\n').map(Number);
};

export const solution = (input: number[]): number => {
    return input.reduce((acc, number, index, array) => (array[index + 1] > number ? acc + 1 : acc), 0);
};
