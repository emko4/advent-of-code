type Graph = Record<string, string[]>;

export const processData = (data: Buffer): Graph => {
    return data
        .toString()
        .split('\n')
        .reduce((acc, line) => {
            const [input, outputs] = line.split(': ');
            return { ...acc, [input]: outputs.split(' ') };
        }, {});
};

type QueueItem = { node: string; path: string[] };

const START_NODE = 'you';
const END_NODE = 'out';

export const solution = (graph: Graph): number => {
    const queue: QueueItem[] = [{ node: START_NODE, path: [START_NODE] }];
    let pathCounter = 0;

    while (queue.length > 0) {
        const { node, path } = queue.shift();

        if (node === END_NODE) {
            pathCounter += 1;
            continue;
        }

        for (const neighbor of graph[node] || []) {
            queue.push({ node: neighbor, path: [...path, neighbor] });
        }
    }

    return pathCounter;
};
