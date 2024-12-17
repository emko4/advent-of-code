type Position = { x: number; y: number };
type Velocity = [number, number];

type Robot = { position: Position; velocity: Velocity };

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

export const processData = (data: Buffer): Robot[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            const [p, v] = line.replaceAll(/[pv=]/g, '').split(' ');

            const [px, py] = p.split(',').map(Number);
            const [vx, vy] = v.split(',').map(Number);

            return { position: { x: px, y: py }, velocity: [vx, vy] };
        }) as Robot[];
};

const printMapWithRobots = (positions: Position[]) => {
    const map = Array(MAP_HEIGHT)
        .fill('')
        .map(() => Array(MAP_WIDTH).fill('.'));

    positions.forEach(({ x, y }) => {
        map[y][x] = map[y][x] === '.' ? 1 : map[y][x] + 1;
    });

    console.log(map.map((l) => l.join('')).join('\n'));
};

export const solution = (input: Robot[]): number => {
    let robotPositions = input.map(({ position }) => position);

    printMapWithRobots(robotPositions);

    for (let i = 0; i < 100; i++) {
        robotPositions = robotPositions.map((position, index) => {
            const [dx, dy] = input[index].velocity;
            const nx = position.x + dx;
            const ny = position.y + dy;

            const x = (nx + MAP_WIDTH) % MAP_WIDTH;
            const y = (ny + MAP_HEIGHT) % MAP_HEIGHT;

            return { x, y };
        });
    }

    printMapWithRobots(robotPositions);

    const quadrants = [0, 0, 0, 0];
    robotPositions.forEach(({ x, y }) => {
        if (x !== Math.floor(MAP_WIDTH / 2) && y !== Math.floor(MAP_HEIGHT / 2)) {
            if (x < MAP_WIDTH / 2 && y < MAP_HEIGHT / 2) quadrants[0] += 1;
            if (x > MAP_WIDTH / 2 && y < MAP_HEIGHT / 2) quadrants[1] += 1;
            if (x > MAP_WIDTH / 2 && y > MAP_HEIGHT / 2) quadrants[2] += 1;
            if (x < MAP_WIDTH / 2 && y > MAP_HEIGHT / 2) quadrants[3] += 1;
        }
    });

    return quadrants.reduce((acc, quadrant) => {
        return acc * quadrant;
    }, 1);
};
