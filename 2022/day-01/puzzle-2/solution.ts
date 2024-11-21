export const processData = (data: Buffer): string[][] => {
    return data
        .toString()
        .split('\n\n')
        .map((elf) => elf.split('\n'));
};

export const solution = (input: string[][]): number => {
    const elves = input.map((elf) => elf.reduce((acc, carriage) => acc + Number(carriage), 0));

    return elves
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((acc, carriage) => acc + carriage, 0);
};
