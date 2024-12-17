type Position = { x: number; y: number };
type Velocity = [number, number];
type Direction = [-1 | 0 | 1, -1 | 0 | 1];

type Robot = { position: Position; velocity: Velocity };
type QueueItem = { position: Position; distance: number };

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

const NEIGHBORS: Direction[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];

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

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const printMapWithRobots = (positions: Position[]) => {
    const map = Array(MAP_HEIGHT)
        .fill('')
        .map(() => Array(MAP_WIDTH).fill('.'));

    positions.forEach(({ x, y }) => {
        map[y][x] = map[y][x] === '.' ? 1 : map[y][x] + 1;
    });

    console.log(map.map((l) => l.join('')).join('\n'));
};

const findPattern = (positions: Position[], pathLength: number): boolean => {
    const uniquePositions = new Set<string>(positions.map((p) => getPositionString(p)));

    for (let position of uniquePositions) {
        const [x, y] = position.split(',').map(Number);

        const visited = new Set<string>();
        const queue: QueueItem[] = [{ position: { x, y }, distance: 1 }];

        while (queue.length > 0) {
            const { position: currentPosition, distance: currentDistance } = queue.shift();
            const currentPositionString = getPositionString(currentPosition);

            if (visited.has(currentPositionString)) continue;
            visited.add(currentPositionString);

            if (currentDistance === pathLength) {
                return true;
            }

            NEIGHBORS.forEach(([dx, dy]) => {
                const position = { x: currentPosition.x + dx, y: currentPosition.y + dy };

                if (uniquePositions.has(getPositionString(position))) {
                    queue.push({ position, distance: currentDistance + 1 });
                }
            });
        }
    }

    return false;
};

export const solution = (input: Robot[]): number => {
    let robotPositions = input.map(({ position }) => position);

    for (let i = 0; i < 10000; i++) {
        robotPositions = robotPositions.map((position, index) => {
            const [dx, dy] = input[index].velocity;
            const nx = position.x + dx;
            const ny = position.y + dy;

            const x = (nx + MAP_WIDTH) % MAP_WIDTH;
            const y = (ny + MAP_HEIGHT) % MAP_HEIGHT;

            return { x, y };
        });

        // value 11 was find by manual testing :)
        if (findPattern(robotPositions, 11)) {
            printMapWithRobots(robotPositions);
            return i + 1;
        }
    }

    return 0;
};
