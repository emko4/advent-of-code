export const processData = (data: Buffer): string => {
    return data.toString();
};

export const solution = (input: string): number => {
    const { left, right } = input.split('').reduce(
        ({ left, right }, char) => ({
            left: char === '(' ? left + 1 : left,
            right: char === ')' ? right + 1 : right,
        }),
        { left: 0, right: 0 },
    );

    return left - right;
};
