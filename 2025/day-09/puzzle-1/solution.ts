type Position = [number, number];

export const processData = (data: Buffer): Position[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            const [y, x] = line.split(',');
            return [Number(x), Number(y)];
        });
};

export const solution = (input: Position[]): number => {
    let result = 0;

    for (let i = 0; i < input.length; i += 1) {
        const [x, y] = input[i];
        for (let j = i + 1; j < input.length; j += 1) {
            const [x2, y2] = input[j];

            const area = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1);
            if (area > result) result = area;
        }
    }

    return result;
};
