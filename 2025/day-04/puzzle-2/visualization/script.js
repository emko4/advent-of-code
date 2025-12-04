const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let map = [[]];

const CELL_SIZE = 20;
const LINE_WIDTH = 1;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

fetch('../../input.txt')
    .then((response) => response.text())
    .then(async (data) => {
        map = data.split('\n').map((line, y) =>
            line.split('').map((item, x) => {
                return item === '@' ? '@' : '';
            }),
        );

        drawGrid();
        await delay(2000);
        await animate();
    });

const drawPaperRoll = (x, y) => {
    const ROWS = map.length;
    const COLS = map[0].length;

    const GRID_WIDTH = COLS * CELL_SIZE;
    const GRID_HEIGHT = ROWS * CELL_SIZE;

    const offsetY = (canvas.width - GRID_WIDTH) / 2;
    const offsetX = (canvas.height - GRID_HEIGHT) / 2;

    const xPosition = offsetY + y * CELL_SIZE;
    const yPosition = offsetX + x * CELL_SIZE;

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('@', xPosition + CELL_SIZE / 2, yPosition + CELL_SIZE / 2);
};

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

            // Draw paper roll
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(map[row][col] === '@' ? '@' : '', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
    }
};

// Highlight the current cell
function highlightCell(x, y, color) {
    const ROWS = map.length;
    const COLS = map[0].length;

    const GRID_WIDTH = COLS * CELL_SIZE;
    const GRID_HEIGHT = ROWS * CELL_SIZE;

    const offsetY = (canvas.width - GRID_WIDTH) / 2;
    const offsetX = (canvas.height - GRID_HEIGHT) / 2;

    ctx.fillStyle = color;
    ctx.fillRect(
        offsetY + y * CELL_SIZE + LINE_WIDTH,
        offsetX + x * CELL_SIZE + LINE_WIDTH,
        CELL_SIZE - 2 * LINE_WIDTH,
        CELL_SIZE - 2 * LINE_WIDTH,
    );
}

const MAX_PAPER_ROLLS = 3;

const checkItem = async (x, y) => {
    if (map[x][y] !== '@') return false;

    drawGrid();

    let paperRollsCount = 0;
    for (let i = x - 1; i <= x + 1; i += 1) {
        if (i < 0 || i >= map.length) continue;

        for (let j = y - 1; j <= y + 1; j += 1) {
            if (j < 0 || j >= map[0].length) continue;
            if (x === i && y === j) continue;

            if (map[i][j] === '@') {
                paperRollsCount += 1;
                highlightCell(i, j, 'rgba(0,255,0,0.3)');
            } else {
                highlightCell(i, j, 'rgba(255,0,0,0.3)');
            }
        }
    }

    if (paperRollsCount > MAX_PAPER_ROLLS) {
        highlightCell(x, y, 'rgba(255,0,0,1)');
    } else {
        highlightCell(x, y, 'rgba(0,255,0,1)');
    }
    drawPaperRoll(x, y);
    await delay(250);

    return paperRollsCount <= MAX_PAPER_ROLLS;
};

const checkMap = async () => {
    let result = 0;

    for (let x = 0; x < map.length; x += 1) {
        for (let y = 0; y < map[0].length; y += 1) {
            const isSuccess = await checkItem(x, y);

            if (isSuccess) {
                map[x][y] = 'X';
                result += 1;
            }
        }
    }

    return result;
};

const animate = async () => {
    let result = 0;

    while (true) {
        const checkResult = await checkMap();

        if (checkResult === 0) break;

        result += checkResult;
    }

    drawGrid();

    for (let x = 0; x < map.length; x += 1) {
        for (let y = 0; y < map[0].length; y += 1) {
            if (map[x][y] === 'X') {
                highlightCell(x, y, 'rgba(0,255,0,1)');
                drawPaperRoll(x, y);
            }
        }
    }

    return result;
};

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
