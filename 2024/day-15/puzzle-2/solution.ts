type Node = '.' | '@' | '#' | '[' | ']';
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

        if (x >= 0) start = { x: x * 2, y };

        return line
            .split('')
            .map((node) => {
                if (node === 'O') return ['[', ']'];
                if (node === '.') return ['.', '.'];
                if (node === '#') return ['#', '#'];
                if (node === '@') return ['@', '.'];
                return [];
            })
            .flat() as Node[];
    });

    return {
        map,
        start,
        moves: moves.split('\n').join('').split('') as Move[],
    };
};

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
};

const getYBoxesToMove = (map: Map, robot: Position, move: Move): Position[] => {
    const result = [];
    const [, dy] = DIRECTION_MAP[move];
    const visited = new Set<string>();

    let queue = [robot];
    while (queue.length > 0) {
        const currentPosition = queue.shift();
        const currentPositionString = getPositionString(currentPosition);

        if (visited.has(currentPositionString)) continue;

        visited.add(currentPositionString);

        if (map[currentPosition.y + dy][currentPosition.x] === '[') {
            queue.push({ x: currentPosition.x, y: currentPosition.y + dy });
            queue.push({ x: currentPosition.x + 1, y: currentPosition.y + dy });

            result.push({ x: currentPosition.x, y: currentPosition.y + dy });
        }

        if (map[currentPosition.y + dy][currentPosition.x] === ']') {
            queue.push({ x: currentPosition.x, y: currentPosition.y + dy });
            queue.push({ x: currentPosition.x - 1, y: currentPosition.y + dy });

            result.push({ x: currentPosition.x - 1, y: currentPosition.y + dy });
        }

        queue = Array.from(new Set(queue.map(getPositionString))).map((p) => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        });
    }

    return Array.from(new Set(result.map(getPositionString)))
        .map((p) => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        })
        .sort((a, b) => (dy < 0 ? a.y - b.y : b.y - a.y));
};

const canYBoxesMove = (map: Map, boxes: Position[], move: Move): boolean => {
    const [, dy] = DIRECTION_MAP[move];

    return boxes.every(({ x, y }) => {
        return map[y + dy][x] !== '#' && map[y + dy][x + 1] !== '#';
    });
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

        // move all possible boxes
        if (map[y + dy][x + dx] === '[' || map[y + dy][x + dx] === ']') {
            // left and right is almost same as in part 1
            if (move === '<' || move === '>') {
                let nextPosition = { x: x + dx, y: y + dy };
                while (map[nextPosition.y][nextPosition.x] === '[' || map[nextPosition.y][nextPosition.x] === ']') {
                    nextPosition = { x: nextPosition.x + dx, y: nextPosition.y + dy };
                }

                if (map[nextPosition.y][nextPosition.x] === '#') return;

                while (map[nextPosition.y][nextPosition.x] !== '@') {
                    map[nextPosition.y][nextPosition.x] = map[nextPosition.y - dy][nextPosition.x - dx];
                    nextPosition = { x: nextPosition.x - dx, y: nextPosition.y - dy };
                }

                map[y][x] = '.';
                map[y + dy][x + dx] = '@';

                currentPosition = { x: x + dx, y: y + dy };
            }

            // up and down use BFS for find all boxes, than check if it is possible move them and if so, do move
            if (move === '^' || move === 'v') {
                const boxesToMove = getYBoxesToMove(map, currentPosition, move);

                if (canYBoxesMove(map, boxesToMove, move)) {
                    boxesToMove.forEach((box) => {
                        map[box.y][box.x] = '.';
                        map[box.y][box.x + 1] = '.';
                        map[box.y + dy][box.x] = '[';
                        map[box.y + dy][box.x + 1] = ']';
                    });

                    map[y][x] = '.';
                    map[y + dy][x + dx] = '@';

                    currentPosition = { x: x + dx, y: y + dy };
                }
            }
        }
    });

    printMap(map);

    let counter = 0;
    map.forEach((line, y) => {
        line.forEach((node, x) => {
            if (node === '[') counter += 100 * y + x;
        });
    });

    return counter;
};
