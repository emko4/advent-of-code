type Node = 'S' | 'E' | '#' | '.';
type Map = Node[][];
type Direction = [0, -1] | [1, 0] | [0, 1] | [-1, 0];
type Position = { x: number; y: number };

type Input = { map: Map; start: Position };
type QueueItem = { position: Position; distance: number };

const NEIGHBORS: Direction[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export const processData = (data: Buffer): Input => {
    let start = null;
    const map = data
        .toString()
        .split('\n')
        .map((line, y) => {
            const x = line.indexOf('S');

            if (x >= 0) start = { x, y };

            return line.split('') as Node[];
        });

    return { map, start };
};

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const isSamePosition = (a: Position, b: Position): boolean => {
    return a.x === b.x && a.y === b.y;
};

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
};

const findBestPathCost = (map: Map, start: Position, cheatPosition?: Position): number => {
    const queue: QueueItem[] = [{ position: start, distance: 0 }];
    const visited: Set<string> = new Set();
    const distances: Record<string, number> = { [getPositionString(start)]: 0 };

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { position: currentPosition, distance } = queue.shift();

        const currentPositionString = getPositionString(currentPosition);

        if (visited.has(currentPositionString)) continue;
        visited.add(currentPositionString);

        if (map[currentPosition.y][currentPosition.x] === 'E') {
            return distance;
        }

        NEIGHBORS.forEach(([dx, dy]) => {
            const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
            const newPositionString = getPositionString(newPosition);
            const newDistance = distance + 1;

            if (
                (map[newPosition.y][newPosition.x] !== '#' ||
                    (cheatPosition && isSamePosition(newPosition, cheatPosition))) &&
                newDistance < (distances[newPositionString] || Infinity)
            ) {
                distances[newPositionString] = newDistance;
                queue.push({ position: newPosition, distance: newDistance });
            }
        });
    }

    return Infinity;
};

const getObstacles = (map: Map): Position[] => {
    const obstacles: Position[] = [];
    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[0].length - 1; x++) {
            if (map[y][x] === '#') obstacles.push({ x, y });
        }
    }

    return obstacles;
};

export const solution = ({ map, start }: Input): number => {
    printMap(map);
    const baseTime = findBestPathCost(map, start);
    const obstacles = getObstacles(map);

    let cheatCounter = 0;
    obstacles.forEach((obstacle, index) => {
        const time = findBestPathCost(map, start, obstacle);

        if (baseTime - time >= 100) cheatCounter += 1;
    });

    return cheatCounter;
};
