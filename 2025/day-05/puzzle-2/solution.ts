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

export const solution = ({ ranges }: Input): number => {
    const joinedRange: number[][] = [];

    const sortedRanges = ranges.toSorted(([startA], [startB]) => startA - startB);

    for (const [start, end] of sortedRanges) {
        if (joinedRange.length === 0) {
            joinedRange.push([start, end]);
            continue;
        }

        const [previousStart, previousEnd] = joinedRange[joinedRange.length - 1];

        if (start <= previousEnd) joinedRange[joinedRange.length - 1] = [previousStart, Math.max(previousEnd, end)];
        else joinedRange.push([start, end]);
    }

    let result = 0;
    for (const [start, end] of joinedRange) {
        result += end - start + 1;
    }

    return result;
};
