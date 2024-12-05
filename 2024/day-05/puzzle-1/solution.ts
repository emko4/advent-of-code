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

const isUpdateValid = (map: Map, update: Update): boolean => {
    return update.every((number, index) => {
        const usedNumbers = new Set(update.slice(0, index));
        const mustBeBefore = map[number] || new Set();

        return usedNumbers.intersection(mustBeBefore).size === 0;
    });
};

export const solution = (input: Input): number => {
    const { map, updates } = input;

    return updates.reduce((acc, update) => {
        if (isUpdateValid(map, update)) {
            const value = update[Math.round((update.length - 1) / 2)];

            return acc + value;
        }

        return acc;
    }, 0);
};
