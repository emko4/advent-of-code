import * as path from 'node:path';

type Position = { x: number; y: number };
type Direction = [-1 | 0 | 1, -1 | 0 | 1];
type Node = '.' | '#';
type Map = Node[][];

type QueueItem = { position: Position; distance: number; path: Position[] };
type FindOutput = { distance: number; path: Position[] };

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

const findShortestPath = (map: Map, start: Position): FindOutput => {
    const queue: QueueItem[] = [{ position: start, distance: 0, path: [start] }];
    const visited: Set<string> = new Set();
    const distances: Record<string, number> = { [getPositionString(start)]: 0 };

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { position: currentPosition, distance, path } = queue.shift();

        const currentPositionString = getPositionString(currentPosition);

        if (visited.has(currentPositionString)) continue;
        visited.add(currentPositionString);

        if (currentPosition.x === MEMORY_SIZE - 1 && currentPosition.y === MEMORY_SIZE - 1) {
            return { distance, path };
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
                queue.push({ position: newPosition, distance: newDistance, path: [...path, newPosition] });
            }
        });
    }

    return { distance: Infinity, path: [] };
};

export const solution = ({ map, positions }: Input): string => {
    const usedPositions = new Set<string>();
    for (let i = BYTE_COUNT; i < positions.length; i++) {
        const { x, y } = positions[i];
        map[y][x] = '#';

        // after first path is found, we check of next byte is in used positions
        if (usedPositions.size > 0 && !usedPositions.has(getPositionString(positions[i]))) continue;

        const { distance, path } = findShortestPath(map, { x: 0, y: 0 });

        if (distance === Infinity) {
            return `${x},${y}`;
        }

        path.forEach((p) => usedPositions.add(getPositionString(p)));
    }

    printMap(map);

    return '0,0';
};
