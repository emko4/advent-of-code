type Map = number[][];
type Position = { x: number; y: number };
type Direction = [-1 | 0 | 1, -1 | 0 | 1];

type Input = {
    map: Map;
    starts: Position[];
};

const NEIGHBORS: Direction[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

export const processData = (data: Buffer): Input => {
    const starts: Position[] = [];
    const map = data
        .toString()
        .split('\n')
        .map((line, y) =>
            line.split('').map((number, x) => {
                if (number === '0') starts.push({ x, y });
                return Number(number);
            }),
        );

    return { map, starts };
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const getCountOfPaths = (map: Map, start: Position): number => {
    const queue: Position[] = [start];

    let counter = 0;

    while (queue.length > 0) {
        const currentPosition = queue.shift();

        if (map[currentPosition.y][currentPosition.x] === 9) {
            // add distinct end of path
            counter += 1;
        }

        NEIGHBORS.forEach(([dx, dy]) => {
            const neighbor = { x: currentPosition.x + dx, y: currentPosition.y + dy };

            if (
                !isOutsideOfMap(map, neighbor) &&
                map[neighbor.y][neighbor.x] === map[currentPosition.y][currentPosition.x] + 1
            ) {
                // use all neighbors with increased number in map
                queue.push(neighbor);
            }
        });
    }

    return counter;
};

export const solution = ({ map, starts }: Input): number => {
    return starts.reduce((acc, start) => {
        return acc + getCountOfPaths(map, start);
    }, 0);
};
