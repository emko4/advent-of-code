export const processData = (data: Buffer): string[][] => {
    return data
        .toString()
        .split('\n\n')
        .map((elf) => elf.split('\n'));
};

export const solution = (input: string[][]): number => {
    return Math.max(...input.map((elf) => elf.reduce((acc, carriage) => acc + Number(carriage), 0)));
};
