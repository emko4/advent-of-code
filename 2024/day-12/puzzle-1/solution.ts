type Map = string[][];
type Position = { x: number; y: number };
type Direction = [-1 | 0 | 1, -1 | 0 | 1];

type Region = { letter: string; areaPositions: Set<string>; fenceLength: number };

const NEIGHBORS: Direction[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export const processData = (data: Buffer): Map => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split(''));
};

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const floodThemAll = (map: Map) => {
    const visited = new Set<string>();
    const regions: Region[] = [];

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            const start: Position = { x: j, y: i };

            if (visited.has(getPositionString(start))) continue;

            const letter = map[start.y][start.x];
            const queue: Position[] = [start];
            const areaPositions = new Set<string>();
            let fenceLength = 0;

            while (queue.length > 0) {
                const currentPosition = queue.shift();
                const currentPositionString = getPositionString(currentPosition);

                if (areaPositions.has(currentPositionString)) continue;

                visited.add(currentPositionString);
                areaPositions.add(currentPositionString);

                NEIGHBORS.forEach(([dx, dy]) => {
                    const neighbor = { x: currentPosition.x + dx, y: currentPosition.y + dy };
                    const neighborLetter = map?.[neighbor.y]?.[neighbor.x];

                    if (isOutsideOfMap(map, neighbor) || neighborLetter !== letter) {
                        fenceLength += 1;
                    } else {
                        queue.push(neighbor);
                    }
                });
            }

            regions.push({
                letter,
                areaPositions,
                fenceLength,
            });
        }
    }

    return regions;
};

export const solution = (input: Map): number => {
    const regions = floodThemAll(input);

    return regions.reduce((acc, { areaPositions, fenceLength }) => {
        return acc + areaPositions.size * fenceLength;
    }, 0);
};
