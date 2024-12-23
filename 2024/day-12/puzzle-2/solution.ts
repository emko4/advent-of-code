// helped
type Map = string[][];
type Position = { x: number; y: number };
type Direction = [-1 | 0 | 1, -1 | 0 | 1];

type Region = {
    letter: string;
    areaPositions: Set<string>;
    borderCount: number;
};

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

const getPositionWithDirectionString = ({ x, y }: Position, [directionX, directionY]: Direction): string => {
    return x + ',' + y + ';' + directionX + ',' + directionY;
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
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
            const borders = new Set<string>();
            let borderCount = 0;

            while (queue.length > 0) {
                const currentPosition = queue.shift();
                const currentPositionString = getPositionString(currentPosition);

                if (areaPositions.has(currentPositionString)) continue;

                visited.add(currentPositionString);
                areaPositions.add(currentPositionString);

                NEIGHBORS.forEach(([dx, dy]) => {
                    const neighbor = { x: currentPosition.x + dx, y: currentPosition.y + dy };

                    if (isOutsideOfMap(map, neighbor) || map[neighbor.y][neighbor.x] !== letter) {
                        borderCount += 1;

                        borders.add(getPositionWithDirectionString(neighbor, [dx, dy]));

                        NEIGHBORS.forEach(([ndx, ndy]) => {
                            const neighborOfNeighbor = { x: neighbor.x + ndx, y: neighbor.y + ndy };

                            if (borders.has(getPositionWithDirectionString(neighborOfNeighbor, [dx, dy]))) {
                                borderCount -= 1;
                            }
                        });
                    } else {
                        queue.push(neighbor);
                    }
                });
            }

            regions.push({
                letter,
                areaPositions,
                borderCount,
            });
        }
    }

    return regions;
};

export const solution = (input: Map): number => {
    printMap(input);
    const regions = floodThemAll(input);

    return regions.reduce((acc, { areaPositions, borderCount }) => {
        return acc + areaPositions.size * borderCount;
    }, 0);
};
