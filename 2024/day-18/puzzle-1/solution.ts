type Position = { x: number; y: number };
type Direction = [-1 | 0 | 1, -1 | 0 | 1];
type Node = '.' | '#';
type Map = Node[][];

type QueueItem = { position: Position; distance: number };

type Input = { map: Map; positions: Position[] };

const MEMORY_SIZE = 71;
const BYTE_COUNT = 1024;

const NEIGHBORS: Direction[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export const processData = (data: Buffer): Input => {
    const positions = data
        .toString()
        .split('\n')
        .map((position) => {
            const [x, y] = position.split(',').map(Number);
            return { x, y };
        });

    const map = Array(MEMORY_SIZE)
        .fill('')
        .map(() => Array(MEMORY_SIZE).fill('.') as Node[]);

    positions.forEach(({ x, y }, index) => {
        if (index < BYTE_COUNT) map[y][x] = '#';
    });

    return { map, positions };
};

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
};

const getPositionString = ({ x, y }: Position): string => {
    return x + ',' + y;
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const findShortestPath = (map: Map, start: Position): number => {
    const queue: QueueItem[] = [{ position: start, distance: 0 }];
    const visited: Set<string> = new Set();
    const distances: Record<string, number> = { [getPositionString(start)]: 0 };

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { position: currentPosition, distance } = queue.shift();

        const currentPositionString = getPositionString(currentPosition);

        if (visited.has(currentPositionString)) continue;
        visited.add(currentPositionString);

        if (currentPosition.x === MEMORY_SIZE - 1 && currentPosition.y === MEMORY_SIZE - 1) {
            return distance;
        }

        NEIGHBORS.forEach(([dx, dy]) => {
            const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
            const newPositionString = getPositionString(newPosition);
            const newDistance = distance + 1;

            if (
                !isOutsideOfMap(map, newPosition) &&
                map[newPosition.y][newPosition.x] !== '#' &&
                newDistance < (distances[newPositionString] || Infinity)
            ) {
                distances[newPositionString] = newDistance;
                queue.push({ position: newPosition, distance: newDistance });
            }
        });
    }

    return 0;
};

export const solution = ({ map }: Input): number => {
    printMap(map);

    return findShortestPath(map, { x: 0, y: 0 });
};
