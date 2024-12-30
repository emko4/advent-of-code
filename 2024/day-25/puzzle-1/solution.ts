type Input = { locks: number[][]; keys: number[][] };

const HEIGHT = 5;

export const processData = (data: Buffer): Input => {
    const locks = [];
    const keys = [];

    data.toString()
        .split('\n\n')
        .forEach((item) => {
            const lines = item.split('\n');

            const configuration = lines.slice(1, 6).reduce(
                (acc, line) => {
                    line.split('').forEach((char, index) => {
                        if (char === '#') acc[index] += 1;
                    });
                    return acc;
                },
                [0, 0, 0, 0, 0],
            );

            if (lines[0] === '#####') {
                locks.push(configuration);
            } else {
                keys.push(configuration);
            }
        });

    return { locks, keys };
};

const isKeyFit = (lock: number[], key: number[]): boolean => {
    return lock.every((gap, index) => gap + key[index] <= HEIGHT);
};

export const solution = ({ locks, keys }: Input): number => {
    let fitCounter = 0;

    locks.forEach((lock) => {
        keys.forEach((key) => {
            if (isKeyFit(lock, key)) fitCounter += 1;
        });
    });

    return fitCounter;
};
