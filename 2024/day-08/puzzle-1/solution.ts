type Position = { x: number; y: number };

type Hash = Record<string, Position[]>;

type Input = {
    width: number;
    height: number;
    hash: Hash;
};

export const processData = (data: Buffer): Input => {
    const lines = data.toString().split('\n');

    const width = lines[0].length;
    const height = lines.length;

    const hash = lines
        .join('')
        .split('')
        .reduce((acc, char, index) => {
            if (char !== '.') {
                const x = index % width;
                const y = Math.floor(index / width);

                return {
                    ...acc,
                    [char]: [...(acc[char] || []), { x, y }],
                };
            }

            return acc;
        }, {} as Hash);

    return { width, height, hash };
};

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const isOutsideOfMap = (position: Position, width: number, height: number): boolean => {
    return position.x < 0 || position.x >= width || position.y < 0 || position.y >= height;
};

const getAntidotesForChar = (width: number, height: number, positions: Position[]): Set<string> => {
    const antidotes = new Set<string>();

    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const distance = [positions[i].x - positions[j].x, positions[i].y - positions[j].y];

            const firstAntidote = { x: positions[i].x + distance[0], y: positions[i].y + distance[1] };
            const secondAntidote = { x: positions[j].x - distance[0], y: positions[j].y - distance[1] };

            if (!isOutsideOfMap(firstAntidote, width, height)) antidotes.add(getPositionString(firstAntidote));
            if (!isOutsideOfMap(secondAntidote, width, height)) antidotes.add(getPositionString(secondAntidote));
        }
    }

    return antidotes;
};

export const solution = ({ width, height, hash }: Input): number => {
    const antidotes = Object.keys(hash).map((char) => getAntidotesForChar(width, height, hash[char]));

    return new Set(antidotes.flatMap((set) => [...set])).size;
};
