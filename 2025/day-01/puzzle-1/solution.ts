export const processData = (data: Buffer): number[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            if (line.startsWith('L')) return -Number(line.slice(1));

            return Number(line.slice(1));
        });
};

const COUNT = 100;

export const solution = (input: number[]): number => {
    let dial = 50;
    let result = 0;

    input.forEach((value) => {
        const rotations = Math.floor(Math.abs(value) / COUNT);

        dial += value;
        dial = (dial + COUNT * (rotations + 1)) % COUNT;

        if (dial === 0) result += 1;
    });

    return result;
};
