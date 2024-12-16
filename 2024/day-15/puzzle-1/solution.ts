type Node = '.' | 'O' | '@' | '#';
type Map = Node[][];
type Move = '^' | '>' | 'v' | '<';
type Direction = [0, -1] | [1, 0] | [0, 1] | [-1, 0];
type Position = { x: number; y: number };

type Input = { map: Map; start: Position; moves: Move[] };

const DIRECTION_MAP: Record<Move, Direction> = {
    '^': [0, -1],
    '>': [1, 0],
    v: [0, 1],
    '<': [-1, 0],
};

export const processData = (data: Buffer): Input => {
    const [mapData, moves] = data.toString().split('\n\n');

    let start = null;
    const map = mapData.split('\n').map((line, y) => {
        const x = line.indexOf('@');

        if (x >= 0) start = { x, y };

        return line.split('') as Node[];
    });

    return {
        map,
        start,
        moves: moves.split('\n').join('').split('') as Move[],
    };
};

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
};

export const solution = (input: Input): number => {
    const { map, start, moves } = input;
    let currentPosition = start;

    moves.forEach((move) => {
        const [dx, dy] = DIRECTION_MAP[move];
        const { x, y } = currentPosition;

        // do nothing for obstacle
        if (map[y + dy][x + dx] === '#') return;

        // move when empty
        if (map[y + dy][x + dx] === '.') {
            map[y][x] = '.';
            map[y + dy][x + dx] = '@';

            currentPosition = { x: x + dx, y: y + dy };
        }

        // move all box in way
        if (map[y + dy][x + dx] === 'O') {
            let nextPosition = { x: x + dx, y: y + dy };
            while (map[nextPosition.y][nextPosition.x] === 'O') {
                nextPosition = { x: nextPosition.x + dx, y: nextPosition.y + dy };
            }

            if (map[nextPosition.y][nextPosition.x] === '#') return;

            while (map[nextPosition.y][nextPosition.x] !== '@') {
                map[nextPosition.y][nextPosition.x] = 'O';
                nextPosition = { x: nextPosition.x - dx, y: nextPosition.y - dy };
            }

            map[y][x] = '.';
            map[y + dy][x + dx] = '@';

            currentPosition = { x: x + dx, y: y + dy };
        }
    });

    printMap(map);

    let counter = 0;
    map.forEach((line, y) => {
        line.forEach((node, x) => {
            if (node === 'O') counter += 100 * y + x;
        });
    });

    return counter;
};
