type Node = 'S' | 'E' | '#' | '.';
type Map = Node[][];
type Direction = [0, -1] | [1, 0] | [0, 1] | [-1, 0];
type Position = { x: number; y: number };
type Turn = 'L' | 'R';

type Input = { map: Map; start: Position };
type QueueItem = { position: Position; direction: Direction; distance: number };

export const processData = (data: Buffer): Input => {
    let start = null;
    const map = data
        .toString()
        .split('\n')
        .map((line, y) => {
            const x = line.indexOf('S');

            if (x >= 0) start = { x, y };

            return line.split('') as Node[];
        });

    return { map, start };
};

const getPositionString = ({ x, y }: Position): string => x + ',' + y;

const getPositionWithDirectionString = ({ x, y }: Position, [dx, dy]: Direction): string =>
    x + ',' + y + ';' + dx + ',' + dy;

const printMap = (map: Map) => {
    console.log(map.map((l) => l.join('')).join('\n'));
};

const turn = (direction: Direction, turn: Turn): Direction => {
    const [directionX, directionY] = direction;

    if (directionY === 0) {
        return turn === 'R' ? [directionY, directionX] : ([directionY, -directionX] as Direction);
    }
    if (directionX === 0) {
        return turn === 'R' ? ([-directionY, directionX] as Direction) : [directionY, directionX];
    }
};

const findBestPathCost = (map: Map, start: Position, direction: Direction): number => {
    const queue: QueueItem[] = [{ position: start, direction, distance: 0 }];
    const visited: Set<string> = new Set();
    const distances: Record<string, number> = { [getPositionWithDirectionString(start, direction)]: 0 };
    const previous: Record<string, string> = {};

    while (queue.length > 0) {
        queue.sort((a, b) => a.distance - b.distance);
        const { position: currentPosition, direction: currentDirection, distance } = queue.shift();

        const currentPositionString = getPositionWithDirectionString(currentPosition, currentDirection);

        if (visited.has(currentPositionString)) continue;
        visited.add(currentPositionString);

        if (map[currentPosition.y][currentPosition.x] === 'E') {
            return distance;
        }

        // reindeer go straight
        [currentDirection].forEach((direction) => {
            const [dx, dy] = direction;
            const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
            const newPositionString = getPositionWithDirectionString(newPosition, direction);
            const newDistance = distance + 1;

            if (map[newPosition.y][newPosition.x] !== '#' && newDistance < (distances[newPositionString] || Infinity)) {
                distances[newPositionString] = newDistance;
                previous[getPositionString(newPosition)] = getPositionString(currentPosition);
                queue.push({ position: newPosition, direction, distance: newDistance });
            }
        });

        // reindeer has to turn => more expensive move
        [turn(currentDirection, 'R'), turn(currentDirection, 'L')].forEach((direction) => {
            const newPositionString = getPositionWithDirectionString(currentPosition, direction);
            const newDistance = distance + 1000;

            if (newDistance < (distances[newPositionString] || Infinity)) {
                distances[newPositionString] = newDistance;
                queue.push({ position: currentPosition, direction, distance: newDistance });
            }
        });
    }

    return Infinity;
};

export const solution = ({ map, start }: Input): number => {
    const eastDirection: Direction = [1, 0];
    printMap(map);
    return findBestPathCost(map, start, eastDirection);
};
