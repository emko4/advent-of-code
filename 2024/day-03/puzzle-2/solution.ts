export const processData = (data: Buffer): string => {
    return data.toString().split('\n').join('');
};

export const solution = (input: string): number => {
    let isDo = true;

    return [...input.matchAll(/mul\(\d+,\d+\)|don't\(\)|do\(\)/g)]
        .map((match) => match[0])
        .filter((match) => {
            if (match === 'do()' || match === "don't()") {
                isDo = match === 'do()';
                return false;
            }

            return isDo;
        })
        .map((match) =>
            match
                .replace(/[mul()]/g, '')
                .split(',')
                .map(Number),
        )
        .reduce((acc, [a, b]) => {
            return acc + a * b;
        }, 0);
};
