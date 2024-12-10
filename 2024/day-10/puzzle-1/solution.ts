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

const getPositionString = ({ x, y }: Position): string => {
    return x + ',' + y;
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const getCountOfPaths = (map: Map, start: Position): number => {
    const visited = new Set<string>();
    const queue: Position[] = [start];

    const ends = new Set<string>();

    while (queue.length > 0) {
        const currentPosition = queue.shift();
        visited.add(getPositionString(currentPosition));

        if (map[currentPosition.y][currentPosition.x] === 9) {
            // add unique end of path
            ends.add(getPositionString(currentPosition));
        }

        NEIGHBORS.forEach(([dx, dy]) => {
            const neighbor = { x: currentPosition.x + dx, y: currentPosition.y + dy };

            if (
                !isOutsideOfMap(map, neighbor) &&
                !visited.has(getPositionString(neighbor)) &&
                map[neighbor.y][neighbor.x] === map[currentPosition.y][currentPosition.x] + 1
            ) {
                // use all unvisited neighbors with increased number in map
                queue.push(neighbor);
            }
        });
    }

    return ends.size;
};

export const solution = ({ map, starts }: Input): number => {
    return starts.reduce((acc, start) => {
        return acc + getCountOfPaths(map, start);
    }, 0);
};
