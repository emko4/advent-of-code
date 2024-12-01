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
    const sortedFirst = input[0].sort();
    const sortedSecond = input[1].sort();

    return sortedFirst.reduce((acc, number, index) => {
        return acc + Math.abs(number - sortedSecond[index]);
    }, 0);
};
