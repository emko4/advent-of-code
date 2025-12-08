import fs from 'fs';

const filePath = process.argv[2];

const rawData = fs.readFileSync(__dirname + '/' + filePath);

type Box = [number, number, number];

const processData = (data: Buffer): Box[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split(',').map(Number) as Box);
};

const getDistance = ([x1, y1, z1]: Box, [x2, y2, z2]: Box): number => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    return dx * dx + dy * dy + dz * dz;
};

const solution = (input: Box[]): number => {
    const boxCount = input.length;

    const inTree = Array<boolean>(boxCount).fill(false);
    const bestDistance = Array<number>(boxCount).fill(Infinity);
    const parent = Array<number>(boxCount).fill(-1);

    bestDistance[0] = 0;

    let lastBoxA = 0;
    let lastBoxB = 0;

    for (let step = 0; step < boxCount; step += 1) {
        let vertex = -1;
        let smallestDistance = Infinity;

        for (let i = 0; i < boxCount; i += 1) {
            if (!inTree[i] && bestDistance[i] < smallestDistance) {
                smallestDistance = bestDistance[i];
                vertex = i;
            }
        }

        inTree[vertex] = true;

        if (parent[vertex] !== -1) {
            lastBoxA = parent[vertex];
            lastBoxB = vertex;
        }

        const boxV = input[vertex];

        for (let j = 0; j < boxCount; j++) {
            if (!inTree[j]) {
                const distance = getDistance(boxV, input[j]);

                if (distance < bestDistance[j]) {
                    bestDistance[j] = distance;
                    parent[j] = vertex;
                }
            }
        }
    }

    return input[lastBoxA][0] * input[lastBoxB][0];
};

const processedInput = processData(rawData);

const result = solution(processedInput);
console.log('Result: ', result);
