export const processData = (data: Buffer): number[][] => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('').map(Number));
};

const BATTERIES_COUNT = 12;

export const solution = (input: number[][]): number => {
    return input.reduce((acc, line) => {
        let batteries = '';
        let currentIndex = 0;
        for (let i = BATTERIES_COUNT; i > 0; i -= 1) {
            const searchLinePart = line.slice(currentIndex, line.length - i + 1);

            const max = Math.max(...searchLinePart);
            const index = currentIndex + searchLinePart.findIndex((number) => number === max);

            batteries += max;
            currentIndex = index + 1;
        }

        return acc + Number('' + batteries);
    }, 0);
};
