type Char = 'X' | 'M' | 'A' | 'S';
type Matrix = Char[][];
type Position = { x: number; y: number };
type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export const processData = (data: Buffer): Matrix => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('') as Char[]);
};

const recursiveStep = (matrix: Matrix, position: Position, direction: Direction, word: string): number => {
    const newPosition: Position = { x: position.x + direction.x, y: position.y + direction.y };

    if (newPosition.x < 0 || newPosition.x > matrix[0].length - 1) return 0;
    if (newPosition.y < 0 || newPosition.y > matrix.length - 1) return 0;

    const [char, ...rest] = word;

    if (char !== matrix[newPosition.y][newPosition.x]) return 0;
    if (char === matrix[newPosition.y][newPosition.x] && rest.join('').length === 0) return 1;

    return recursiveStep(matrix, newPosition, direction, rest.join(''));
};

const getCountOfWordFromPoint = (matrix: Matrix, position: Position, word: string) => {
    const [char, ...rest] = word;

    if (char !== matrix[position.y][position.x]) return 0;

    let counter = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            const direction = { x, y } as Direction;

            counter += recursiveStep(matrix, position, direction, rest.join(''));
        }
    }

    return counter;
};

export const solution = (matrix: Matrix): number => {
    let counter = 0;

    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            counter += getCountOfWordFromPoint(matrix, { x, y }, 'XMAS');
        }
    }

    return counter;
};
