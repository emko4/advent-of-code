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

type StackItem = { node: string; multiplier: number; wantedNodes: string[] };

const START_NODE = 'svr';
const END_NODE = 'out';
const WANTED_NODES = ['fft', 'dac'];

const hasAllWantedNodes = (wantedNodes: string[]): boolean => {
    return WANTED_NODES.every((wantedNode) => wantedNodes.includes(wantedNode));
};

export const solution = (graph: Graph): number => {
    const stack: StackItem[] = [{ node: START_NODE, multiplier: 1, wantedNodes: [] }];
    let pathCounter = 0;

    // main stack loop
    while (stack.length > 0) {
        const levelNodes: StackItem[] = [];

        // make a level of graph
        while (stack.length > 0) {
            const { node, multiplier, wantedNodes } = stack.pop();

            // if node is end node and path has all wanted nodes - increase path counter by multiplier
            if (node === END_NODE && hasAllWantedNodes(wantedNodes)) {
                pathCounter += multiplier;
                continue;
            }

            // add all neighbors to level stack
            // if neighbor is wanted node - save it
            for (const neighbor of graph[node] || []) {
                if (WANTED_NODES.includes(neighbor)) {
                    levelNodes.push({ node: neighbor, multiplier, wantedNodes: [...wantedNodes, neighbor] });
                } else {
                    levelNodes.push({ node: neighbor, multiplier, wantedNodes });
                }
            }
        }

        // merge nodes with same name and wanted nodes
        // by creating a key with node name and wanted nodes joined with '-' character
        const merged: Record<string, number> = levelNodes.reduce((acc, { node, multiplier, wantedNodes }) => {
            const wanted = wantedNodes.toSorted((a, b) => a.localeCompare(b)).join('_');
            const key = `${node}${wanted ? '-' + wanted : ''}`;

            return { ...acc, [key]: (acc[key] || 0) + multiplier };
        }, {});

        // recreate node objects from merged structure and add them to main stack
        stack.push(
            ...Object.keys(merged).map((key) => {
                const [node, wantedNodesString] = key.split('-');
                const wantedNodes = wantedNodesString ? wantedNodesString.split('_') : [];

                return { node, multiplier: merged[key], wantedNodes };
            }),
        );
    }

    // return sum of paths which contains all wanted nodes
    return pathCounter;
};
