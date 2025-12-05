type Input = {
    ranges: number[][];
    ids: number[];
};

export const processData = (data: Buffer): Input => {
    const [ranges, ids] = data.toString().split('\n\n');

    return {
        ranges: ranges.split('\n').map((range) => range.split('-').map(Number)),
        ids: ids.split('\n').map(Number),
    };
};

export const solution = ({ ranges, ids }: Input): number => {
    let counter = 0;
    for (const id of ids) {
        for (const range of ranges) {
            const [start, end] = range;

            if (id >= start && id <= end) {
                counter += 1;
                break;
            }
        }
    }

    return counter;
};
