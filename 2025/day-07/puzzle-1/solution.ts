type Node = 'S' | '.' | '^';
type Map = Node[][];
type Position = [number, number];

export const processData = (data: Buffer): Map => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('') as Node[]);
};

const isOutsideOfMap = (map: Map, [x, y]: Position): boolean => {
    return x < 0 || x >= map.length || y < 0 || y >= map[0].length;
};

export const solution = (map: Map): number => {
    const startX = 0;
    const startY = map[0].findIndex((line) => line.includes('S'));

    const queue: Position[] = [[startX, startY]];
    const visited = new Set<string>();

    let splits = 0;

    while (queue.length > 0) {
        const currentPosition = queue.shift();

        if (isOutsideOfMap(map, currentPosition)) continue;
        if (visited.has(`${currentPosition[0]},${currentPosition[1]}`)) continue;

        visited.add(`${currentPosition[0]},${currentPosition[1]}`);

        if (
            map[currentPosition[0]][currentPosition[1]] === '.' ||
            map[currentPosition[0]][currentPosition[1]] === 'S'
        ) {
            const newPosition: Position = [currentPosition[0] + 1, currentPosition[1]];
            queue.push(newPosition);
        }

        if (map[currentPosition[0]][currentPosition[1]] === '^') {
            const leftPosition: Position = [currentPosition[0], currentPosition[1] - 1];
            if (!isOutsideOfMap(map, leftPosition)) queue.push(leftPosition);

            const rightPosition: Position = [currentPosition[0], currentPosition[1] + 1];
            if (!isOutsideOfMap(map, rightPosition)) queue.push(rightPosition);

            splits += 1;
        }
    }

    return splits;
};
