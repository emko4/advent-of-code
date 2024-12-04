type Char = 'X' | 'M' | 'A' | 'S';
type Matrix = Char[][];
type Position = { x: number; y: number };

export const processData = (data: Buffer): Matrix => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('') as Char[]);
};

const isPointMAS = (matrix: Matrix, position: Position): boolean => {
    const firstDiagonal = [
        matrix[position.y - 1]?.[position.x - 1] || '',
        matrix[position.y]?.[position.x] || '',
        matrix[position.y + 1]?.[position.x + 1] || '',
    ].join('');

    const secondDiagonal = [
        matrix[position.y + 1]?.[position.x - 1] || '',
        matrix[position.y]?.[position.x] || '',
        matrix[position.y - 1]?.[position.x + 1] || '',
    ].join('');

    return (
        (firstDiagonal === 'MAS' || firstDiagonal === 'SAM') && (secondDiagonal === 'MAS' || secondDiagonal === 'SAM')
    );
};

export const solution = (matrix: Matrix): number => {
    let counter = 0;

    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            if (matrix[y][x] === 'A') {
                counter += isPointMAS(matrix, { x, y }) ? 1 : 0;
            }
        }
    }

    return counter;
};
