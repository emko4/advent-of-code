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

            let firstAntenna = { x: positions[i].x, y: positions[i].y };
            let secondAntenna = { x: positions[j].x, y: positions[j].y };

            while (!isOutsideOfMap(firstAntenna, width, height)) {
                antidotes.add(getPositionString(firstAntenna));

                firstAntenna = { x: firstAntenna.x + distance[0], y: firstAntenna.y + distance[1] };
            }

            while (!isOutsideOfMap(secondAntenna, width, height)) {
                antidotes.add(getPositionString(secondAntenna));

                secondAntenna = { x: secondAntenna.x - distance[0], y: secondAntenna.y - distance[1] };
            }
        }
    }

    return antidotes;
};

export const solution = ({ width, height, hash }: Input): number => {
    const antidotes = Object.keys(hash).map((char) => getAntidotesForChar(width, height, hash[char]));

    return new Set(antidotes.flatMap((set) => [...set])).size;
};
