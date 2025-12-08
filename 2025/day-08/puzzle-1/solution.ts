type Box = [number, number, number];

export const processData = (data: Buffer): Box[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => line.split(',').map(Number) as Box);
};

const getDistance = ([x1, y1, z1]: Box, [x2, y2, z2]: Box): number =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));

const PAIRS_COUNT = 1000;
const RESULT_CIRCUITS_COUNT = 3;

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

    for (let i = 0; i < PAIRS_COUNT; i += 1) {
        const [boxA, , boxB] = sortedEdges.shift();

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

    const sortedCircuits = circuits.toSorted((circuitA, circuitB) => circuitB.size - circuitA.size);

    let result = 1;
    for (let i = 0; i < RESULT_CIRCUITS_COUNT; i += 1) {
        result *= sortedCircuits?.[i]?.size || 1;
    }

    return result;
};
