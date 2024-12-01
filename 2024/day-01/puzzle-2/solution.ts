export const processData = (data: Buffer): number[][] => {
    return data
        .toString()
        .split('\n')
        .reduce(
            (acc, line) => {
                const [first, second] = line.split('   ');

                return [
                    [...acc[0], Number(first)],
                    [...acc[1], Number(second)],
                ];
            },
            [[], []] as number[][],
        );
};

export const solution = (input: number[][]): number => {
    const countMap = input[1].reduce(
        (acc, number) => {
            return {
                ...acc,
                [number]: (acc[number] || 0) + 1,
            };
        },
        {} as Record<string, number>,
    );

    return input[0].reduce((acc, number) => {
        return acc + number * (countMap[number] || 0);
    }, 0);
};
