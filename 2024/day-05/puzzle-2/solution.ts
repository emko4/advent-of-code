type Map = Record<number, Set<number>>;
type Update = number[];

type Input = { map: Map; updates: Update[] };

export const processData = (data: Buffer): Input => {
    const [map, updates] = data.toString().split('\n\n');

    return {
        map: map
            .split('\n')
            .map((tuple) => tuple.split('|').map(Number))
            .reduce((acc, [key, value]) => {
                return { ...acc, [key]: acc[key] ? acc[key].add(value) : new Set([value]) };
            }, {} as Map),
        updates: updates.split('\n').map((line) => line.split(',').map(Number)),
    };
};

const correctInvalidUpdate = (map: Map, update: Update): Update => {
    return update.reduce((acc, number, index) => {
        const usedNumbers = new Set(acc.slice(0, index));
        const mustBeBefore = map[number] || new Set();

        const intersection = usedNumbers.intersection(mustBeBefore);

        // update is correct for now
        if (intersection.size === 0) {
            return [...acc, number];
        }

        // find correct index for current number
        let correctIndex = acc.length;
        for (let i = acc.length - 1; i >= 0; i--) {
            if (mustBeBefore.has(acc[i])) correctIndex = i;
        }

        return [...acc.slice(0, correctIndex), number, ...acc.slice(correctIndex)];
    }, [] as number[]);
};

export const solution = (input: Input): number => {
    const { map, updates } = input;

    return updates.reduce((acc, update) => {
        const correctedUpdate = correctInvalidUpdate(map, update);

        if (update.some((number, index) => number !== correctedUpdate[index])) {
            const value = correctedUpdate[Math.round((correctedUpdate.length - 1) / 2)];

            return acc + value;
        }

        return acc;
    }, 0);
};
