type Place = '.' | '#';
type Map = Place[][];
type Direction = [0, -1] | [1, 0] | [0, 1] | [-1, 0];
type Turn = 'L' | 'R';
type Position = { x: number; y: number };

type Input = { map: Map; start: Position };

export const processData = (data: Buffer): Input => {
    let start: Position;
    const map = data
        .toString()
        .split('\n')
        .map(
            (line, y) =>
                line.split('').map((position, x) => {
                    if (position === '^') {
                        start = { x, y };
                        return '.';
                    }

                    return position;
                }) as Place[],
        );

    return { map, start };
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

const move = (position: Position, direction: Direction): Position => {
    return { x: position.x + direction[0], y: position.y + direction[1] };
};

const isObstacle = (map: Map, { x, y }: Position): boolean => {
    return map[y][x] === '#';
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const getPositionString = ({ x, y }: Position): string => {
    return `${x},${y}`;
};

const getCountOfVisitedPlaces = (map: Map, start: Position, direction: Direction): number => {
    const visitedPlaces = new Set<string>([getPositionString(start)]);
    let currentPosition = start;
    let currentDirection = direction;

    while (!isOutsideOfMap(map, currentPosition)) {
        const newPosition = move(currentPosition, currentDirection);

        if (isOutsideOfMap(map, newPosition)) {
            break;
        }

        if (isObstacle(map, newPosition)) {
            currentDirection = turn(currentDirection, 'R');
            continue;
        }

        visitedPlaces.add(getPositionString(newPosition));
        currentPosition = newPosition;
    }

    return visitedPlaces.size;
};

export const solution = ({ map, start }: Input): number => {
    const northDirection: Direction = [0, -1];

    return getCountOfVisitedPlaces(map, start, northDirection);
};
