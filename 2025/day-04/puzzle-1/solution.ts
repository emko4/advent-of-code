type Item = '.' | '@';
type Map = Item[][];

export const processData = (data: Buffer): Map => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('') as Item[]);
};

const MAX_PAPER_ROLLS = 3;

const checkItem = (map: Map, x: number, y: number): boolean => {
    if (map[x][y] !== '@') return false;

    let paperRollsCount = 0;

    for (let i = x - 1; i <= x + 1; i += 1) {
        if (i < 0 || i >= map.length) continue;

        for (let j = y - 1; j <= y + 1; j += 1) {
            if (j < 0 || j >= map[0].length) continue;
            if (x === i && y === j) continue;

            if (map[i][j] === '@') paperRollsCount += 1;
        }
    }

    return paperRollsCount <= MAX_PAPER_ROLLS;
};

export const solution = (map: Map): number => {
    let result = 0;

    for (let x = 0; x < map.length; x += 1) {
        for (let y = 0; y < map[0].length; y += 1) {
            if (checkItem(map, x, y)) result += 1;
        }
    }

    return result;
};
