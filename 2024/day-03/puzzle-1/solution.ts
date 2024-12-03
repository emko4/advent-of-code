export const processData = (data: Buffer): string => {
    return data.toString().split('\n').join('');
};

export const solution = (input: string): number => {
    return [...input.matchAll(/mul\(\d+,\d+\)/g)]
        .map((match) =>
            match[0]
                .replace(/[mul()]/g, '')
                .split(',')
                .map(Number),
        )
        .reduce((acc, [a, b]) => {
            return acc + a * b;
        }, 0);
};
