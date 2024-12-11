const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let map = [[]];
const starts = [];
const CELL_SIZE = 16;
const LINE_WIDTH = 1;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// let currentStep = 0;
const NEIGHBORS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

const isOutsideOfMap = (map, { x, y }) => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const getCountOfPaths = async (map, start) => {
    const queue = [start];

    let counter = 0;

    while (queue.length > 0) {
        await delay(100);
        const currentPosition = queue.shift();

        const number = map[currentPosition.y][currentPosition.x];
        if (number > 0 && number < 9) highlightCell(currentPosition.x, currentPosition.y, 'rgba(0,0,255,0.2)');

        if (number === 9) {
            // add distinct end of path
            counter += 1;
            highlightCell(currentPosition.x, currentPosition.y, 'rgba(255,0,0,0.2)');
        }

        NEIGHBORS.forEach(([dx, dy]) => {
            const neighbor = { x: currentPosition.x + dx, y: currentPosition.y + dy };

            if (
                !isOutsideOfMap(map, neighbor) &&
                map[neighbor.y][neighbor.x] === map[currentPosition.y][currentPosition.x] + 1
            ) {
                // use all neighbors with increased number in map
                queue.push(neighbor);
            }
        });
    }

    return counter;
};

fetch('../../input.txt')
    .then((response) => response.text())
    .then(async (data) => {
        map = data.split('\n').map((line, y) =>
            line.split('').map((number, x) => {
                if (number === '0') starts.push({ x, y });
                return Number(number);
            }),
        );
        drawGrid();
        await delay(2000);
        animatePath();
    });

const drawGrid = () => {
    const ROWS = map.length;
    const COLS = map[0].length;

    const GRID_WIDTH = COLS * CELL_SIZE;
    const GRID_HEIGHT = ROWS * CELL_SIZE;

    const offsetX = (canvas.width - GRID_WIDTH) / 2;
    const offsetY = (canvas.height - GRID_HEIGHT) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = offsetX + col * CELL_SIZE;
            const y = offsetY + row * CELL_SIZE;

            // Draw cell
            ctx.strokeStyle = 'black';
            ctx.lineWidth = LINE_WIDTH;
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            if (map[row][col] === 0) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x + LINE_WIDTH, y + LINE_WIDTH, CELL_SIZE - 2 * LINE_WIDTH, CELL_SIZE - 2 * LINE_WIDTH);
            }

            // Draw number
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(map[row][col], x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
    }
};

// Highlight the current cell
function highlightCell(x, y, color) {
    const ROWS = map.length;
    const COLS = map[0].length;

    const GRID_WIDTH = COLS * CELL_SIZE;
    const GRID_HEIGHT = ROWS * CELL_SIZE;

    const offsetX = (canvas.width - GRID_WIDTH) / 2;
    const offsetY = (canvas.height - GRID_HEIGHT) / 2;

    ctx.fillStyle = color;
    ctx.fillRect(
        offsetX + x * CELL_SIZE + LINE_WIDTH,
        offsetY + y * CELL_SIZE + LINE_WIDTH,
        CELL_SIZE - 2 * LINE_WIDTH,
        CELL_SIZE - 2 * LINE_WIDTH,
    );

    // Draw number
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(map[y][x], offsetX + x * CELL_SIZE + CELL_SIZE / 2, offsetY + y * CELL_SIZE + CELL_SIZE / 2);
}

function animatePath() {
    // if (currentStep < path.length) {
    //     const { x, y } = path[currentStep];
    //     highlightCell(x, y, 'blue');
    //     currentStep++;
    //     console.log('[DEV]', x, y);
    //     setTimeout(animatePath, 500);
    // }
    starts.forEach((start) => {
        getCountOfPaths(map, start);
    });
}

const resizeCanvas = () => {
    // Adjust canvas size to fill the viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawGrid();
};

// Resize canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
