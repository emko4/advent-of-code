const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let graph = {};

const NODE_RADIUS = 20;
const LINE_WIDTH = 1;
const LEVEL_OFFSET = 30;
const DELAY = 150;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

fetch('./graph.txt')
    .then((response) => response.text())
    .then(async (data) => {
        graph = data
            .toString()
            .split('\n')
            .reduce((acc, line) => {
                const [input, outputs] = line.split(': ');
                return { ...acc, [input]: outputs.split(' ') };
            }, {});

        await delay(5000);
        await animate();
    });

const START_NODE = 'svr';
const END_NODE = 'out';
const WANTED_NODES = ['fft', 'dac'];

const nodes = {};
const mergedNodes = {};

const animate = async () => {
    const stack = [{ node: START_NODE, multiplier: 1, wantedNodes: [] }];

    let pathCounter = 0;

    let level = 0;
    nodes[level] = [{ node: START_NODE, multiplier: 1 }];
    mergedNodes[level] = [{ node: START_NODE, multiplier: 1 }];

    drawNodes();
    await delay(DELAY);

    // main stack loop
    while (stack.length > 0) {
        const levelNodes = [];
        level += 1;

        // make a level of graph
        while (stack.length > 0) {
            const { node, multiplier, wantedNodes } = stack.pop();

            // if node is end node and path has all wanted nodes - increase path counter by multiplier
            if (node === END_NODE && WANTED_NODES.every((wantedNode) => wantedNodes.includes(wantedNode))) {
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

            nodes[level] = [...levelNodes];
        }

        // merge nodes with same name and wanted nodes
        // by creating a key with node name and wanted nodes joined with '-' character
        const merged = levelNodes.reduce((acc, { node, multiplier, wantedNodes }) => {
            const wanted = wantedNodes.toSorted((a, b) => a.localeCompare(b)).join('_');
            const key = `${node}${wanted ? '-' + wanted : ''}`;

            return { ...acc, [key]: (acc[key] || 0) + multiplier };
        }, {});

        const mergedDraw = levelNodes.reduce((acc, { node }) => {
            return { ...acc, [node]: 0 };
        }, {});

        mergedNodes[level] = Object.keys(mergedDraw).map((key) => ({ node: key, multiplier: 1 }));
        // recreate node objects from merged structure and add them to main stack
        stack.push(
            ...Object.keys(merged).map((key) => {
                const [node, wantedNodesString] = key.split('-');
                const wantedNodes = wantedNodesString ? wantedNodesString.split('_') : [];

                return { node, multiplier: merged[key], wantedNodes };
            }),
        );

        drawNodes(true);
        await delay(DELAY);
        drawNodes();
        await delay(DELAY);
    }

    // return sum of paths which contains all wanted nodes
    return pathCounter;
};

const drawNodes = (lastUnmerged = false) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const MAX_LEVEL = Math.floor((canvas.height - 2 * LEVEL_OFFSET) / (NODE_RADIUS * 2 + LEVEL_OFFSET));

    const length = Object.keys(nodes).length;

    for (let i = Math.max(length - MAX_LEVEL, 0), j = 0; i < length; i += 1, j += 1) {
        const level = Number(j);
        const levelNodes = i === length - 1 && lastUnmerged ? nodes[i] : mergedNodes[i];

        const levelY = LEVEL_OFFSET + (NODE_RADIUS + (NODE_RADIUS + LEVEL_OFFSET + NODE_RADIUS) * level);

        const POSSIBLE_WIDTH = canvas.width - 2 * LEVEL_OFFSET;

        const LEVEL_NODE_RADIUS = Math.min((8 * POSSIBLE_WIDTH) / (11 * levelNodes.length + 7) / 2, NODE_RADIUS);
        const LEVEL_NODE_OFFSET = (LEVEL_NODE_RADIUS / 4) * 3;

        const LEVEL_ROW_OFFSET =
            (POSSIBLE_WIDTH - LEVEL_NODE_RADIUS * 2 * levelNodes.length - LEVEL_NODE_OFFSET * (levelNodes.length - 1)) /
            2;

        // first draw lines between nodes
        if (i < length - 1 && !(lastUnmerged && i === length - 2)) {
            levelNodes.forEach(({ node }, index) => {
                const x =
                    LEVEL_OFFSET +
                    LEVEL_ROW_OFFSET +
                    LEVEL_NODE_RADIUS +
                    (LEVEL_NODE_RADIUS * 2 + LEVEL_NODE_OFFSET) * index;

                const nextNodes = graph[node] || [];
                const nextLevelNodes = i === length - 1 && lastUnmerged ? nodes[i + 1] : mergedNodes[i + 1];

                const nextLevelY =
                    LEVEL_OFFSET + (NODE_RADIUS + (NODE_RADIUS + LEVEL_OFFSET + NODE_RADIUS) * (level + 1));

                nextNodes.forEach((nextNode) => {
                    const nextIndex = nextLevelNodes.findIndex((n) => n.node === nextNode);

                    const NEXT_LEVEL_NODE_RADIUS = Math.min(
                        (8 * POSSIBLE_WIDTH) / (11 * nextLevelNodes.length + 7) / 2,
                        NODE_RADIUS,
                    );
                    const NEXT_LEVEL_NODE_OFFSET = (NEXT_LEVEL_NODE_RADIUS / 4) * 3;

                    const NEXT_LEVEL_ROW_OFFSET =
                        (POSSIBLE_WIDTH -
                            NEXT_LEVEL_NODE_RADIUS * 2 * nextLevelNodes.length -
                            NEXT_LEVEL_NODE_OFFSET * (nextLevelNodes.length - 1)) /
                        2;

                    const nextX =
                        LEVEL_OFFSET +
                        NEXT_LEVEL_ROW_OFFSET +
                        NEXT_LEVEL_NODE_RADIUS +
                        (NEXT_LEVEL_NODE_RADIUS * 2 + NEXT_LEVEL_NODE_OFFSET) * nextIndex;

                    drawPath(x, levelY, nextX, nextLevelY);
                });
            });
        }

        // then draw nodes
        levelNodes.forEach(({ node, multiplier, wantedNodes }, index) => {
            const x =
                LEVEL_OFFSET +
                LEVEL_ROW_OFFSET +
                LEVEL_NODE_RADIUS +
                (LEVEL_NODE_RADIUS * 2 + LEVEL_NODE_OFFSET) * index;

            if (WANTED_NODES.includes(node)) drawNode(x, levelY, node, multiplier, LEVEL_NODE_RADIUS, 'green');
            else if (node === END_NODE) drawNode(x, levelY, node, multiplier, LEVEL_NODE_RADIUS, 'blue');
            else drawNode(x, levelY, node, multiplier, LEVEL_NODE_RADIUS);
        });
    }
};

const drawNode = (x, y, label, multiplier, radius = NODE_RADIUS, color = 'black') => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = `${(radius / 6) * 5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
};

const drawPath = (x1, y1, x2, y2, color = 'black') => {
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = color;

    ctx.beginPath(); // Start a new path
    ctx.moveTo(x1, y1); // Move the pen to (30, 50)
    ctx.lineTo(x2, y2); // Draw a line to (150, 100)
    ctx.stroke(); // Render the path
};

const resizeCanvas = () => {
    // Adjust canvas size to fill the viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawNodes();
};

// Resize canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
