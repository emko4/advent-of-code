type Node = 'S' | '.' | '^';
type Map = Node[][];

export const processData = (data: Buffer): Map => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split('') as Node[]);
};

export const solution = (map: Map): number => {
    const array: number[] = map[0].map((node) => (node === 'S' ? 1 : 0));

    for (let i = 2; i < map.length; i += 2) {
        for (let j = 0; j < map[i].length; j += 1) {
            if (map[i][j] === '^') {
                array[j - 1] += array[j];
                array[j + 1] += array[j];
                array[j] = 0;
            }
        }
    }

    return array.reduce((acc, number) => acc + number, 0);
};
