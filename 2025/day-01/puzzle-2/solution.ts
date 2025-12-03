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
        const previousDial = dial;
        const newDial = dial + value;

        const REST_VALUE = Math.abs(value) % COUNT;

        let rotations = Math.floor(Math.abs(value) / COUNT);
        if (value < 0 && previousDial !== 0 && previousDial - REST_VALUE <= 0) rotations += 1;
        if (value > 0 && previousDial + REST_VALUE >= COUNT) rotations += 1;

        dial = (newDial + COUNT * (rotations + 1)) % COUNT;

        result += rotations;
    });

    return result;
};
