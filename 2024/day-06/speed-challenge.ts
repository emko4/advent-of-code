import fs from 'fs';

const filePath = process.argv[2];

const rawData = fs.readFileSync(__dirname + '/' + filePath);

type Place = '.' | '#';
type Map = Place[][];
type Direction = [0, -1] | [1, 0] | [0, 1] | [-1, 0];
type Turn = 'L' | 'R';
type Position = { x: number; y: number };

type Input = { map: Map; start: Position };

type Path = { position: Position; direction: Direction }[];

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

const isSamePosition = (a: Position, b: Position): boolean => {
    return a.x === b.x && a.y === b.y;
};

const isObstacle = (map: Map, { x, y }: Position): boolean => {
    return map[y][x] === '#';
};

const isOutsideOfMap = (map: Map, { x, y }: Position): boolean => {
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
};

const isPathInCycle = (visitedPlacesWithDirection: Set<string>, position: Position, direction: Direction): boolean => {
    return visitedPlacesWithDirection.has(getPositionWithDirectionString(position, direction));
};

const getPositionString = ({ x, y }: Position): string => {
    return x + ',' + y;
};

const getPositionWithDirectionString = ({ x, y }: Position, [directionX, directionY]: Direction): string => {
    return x + ',' + y + ';' + directionX + ',' + directionY;
};

const getVisitedPlaces = (map: Map, start: Position, direction: Direction): Path => {
    const visitedPlaces: Path = [{ position: start, direction }];
    const visitedPlacesSet = new Set([getPositionString(start)]);
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

        const newPositionString = getPositionString(newPosition);
        if (!visitedPlacesSet.has(newPositionString)) {
            visitedPlacesSet.add(newPositionString);
            visitedPlaces.push({ position: newPosition, direction: currentDirection });
        }
        currentPosition = newPosition;
    }

    return visitedPlaces;
};

const isCycleWithAddedObstacle = (map: Map, start: Position, direction: Direction, obstacle: Position): boolean => {
    const visitedPlacesWithDirections = new Set<string>();
    let currentPosition = start;
    let currentDirection = direction;

    while (!isPathInCycle(visitedPlacesWithDirections, currentPosition, currentDirection)) {
        visitedPlacesWithDirections.add(getPositionWithDirectionString(currentPosition, currentDirection));

        const newPosition = move(currentPosition, currentDirection);

        if (isOutsideOfMap(map, newPosition)) {
            return false;
        }

        if (isObstacle(map, newPosition) || isSamePosition(newPosition, obstacle)) {
            currentDirection = turn(currentDirection, 'R');
            continue;
        }

        currentPosition = newPosition;
    }

    return true;
};

export const solution = ({ map, start }: Input): number => {
    const northDirection: Direction = [0, -1];

    const visitedPlaces = getVisitedPlaces(map, start, northDirection);

    return visitedPlaces.reduce((acc, { position }, index) => {
        const { x, y } = position;

        // I can start from previous position for every obstacle
        const { position: previousPosition, direction: previousDirection } = visitedPlaces[index - 1] || {
            position: start,
            direction: northDirection,
        };

        const isCycle = isCycleWithAddedObstacle(map, previousPosition, previousDirection, { x, y });

        return acc + (isCycle ? 1 : 0);
    }, 0);
};

const processedInput = processData(rawData);

const result = solution(processedInput);
console.log('Result: ', result);
