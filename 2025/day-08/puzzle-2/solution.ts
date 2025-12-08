type Box = [number, number, number];

export const processData = (data: Buffer): Box[] => {
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

export const solution = (input: Box[]): number => {
    const edges: [number, number, number][] = [];

    for (let i = 0; i < input.length; i += 1) {
        for (let j = i + 1; j < input.length; j += 1) {
            edges.push([i, getDistance(input[i], input[j]), j]);
        }
    }

    const sortedEdges = edges.toSorted((edgeA, edgeB) => edgeA[1] - edgeB[1]);

    const usedBoxes = new Set<number>();
    let circuits: Set<number>[] = [];
    let result = 0;
    while (usedBoxes.size < input.length) {
        const [boxA, , boxB] = sortedEdges.shift();
        result = input[boxA][0] * input[boxB][0];

        if (usedBoxes.has(boxA) && usedBoxes.has(boxB)) {
            const circuitAIndex = circuits.findIndex((c) => c.has(boxA));
            const circuitBIndex = circuits.findIndex((c) => c.has(boxB));

            if (circuitAIndex !== circuitBIndex) {
                circuits = circuits.reduce((acc, c, index) => {
                    if (circuitAIndex === index) return [...acc, c.union(circuits[circuitBIndex])];
                    if (circuitBIndex === index) return acc;

                    return [...acc, c];
                }, []);
            }

            continue;
        }

        const circuit = circuits.find((c) => c.has(boxA) || c.has(boxB));
        if (!circuit) {
            circuits.push(new Set([boxA, boxB]));
        } else {
            circuit.add(boxA).add(boxB);
        }

        usedBoxes.add(boxA).add(boxB);
    }

    return result;
};
