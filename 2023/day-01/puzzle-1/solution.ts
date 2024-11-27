export const processData = (data: Buffer): string[] => {
    return data.toString().split('\n');
};

export const solution = (input: string[]): number => {
    return input.reduce((acc, line) => {
        const stringNumber = line.replace(/\D/g, '');

        return acc + Number(`${stringNumber[0]}${stringNumber[stringNumber.length - 1]}`);
    }, 0);
};
