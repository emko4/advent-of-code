type Pattern = string;
type Towel = string;

type Input = { patterns: Pattern[]; towels: Towel[] };

export const processData = (data: Buffer): Input => {
    const [patterns, towels] = data.toString().split('\n\n');

    return {
        patterns: patterns.split(', '),
        towels: towels.split('\n'),
    };
};

const isTowelPossible = (patterns: Pattern[], towel: Towel): boolean => {
    const queue: number[] = [0];
    const visited = new Set<number>();

    while (queue.length > 0) {
        const index = queue.shift();

        if (visited.has(index)) continue;
        visited.add(index);

        if (index === towel.length) return true;

        patterns.forEach((pattern) => {
            if (towel.substring(index, index + pattern.length) === pattern) {
                queue.push(index + pattern.length);
            }
        });
    }

    return false;
};

export const solution = ({ patterns, towels }: Input): number => {
    return towels.reduce((acc, towel, index) => {
        return acc + (isTowelPossible(patterns, towel) ? 1 : 0);
    }, 0);
};
