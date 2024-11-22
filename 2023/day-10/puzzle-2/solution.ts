type Node = 'S' | '|' | '-' | '7' | 'J' | 'L' | 'F' | '.';
type Direction = '-1,0' | '0,1' | '1,0' | '0,-1';
type Axis = -1 | 0 | 1;
type DirectionNumber = [Axis, Axis];
type Matrix = Node[][];
type Position = { x: number; y: number; type: Node };

export const processData = (data: Buffer): Matrix => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            return line.split('') as Node[];
        });
};

const transitions: Record<Node, Record<Direction, Node[]>> = {
    S: {
        '-1,0': ['7', '|', 'F'],
        '0,1': ['J', '-', '7'],
        '1,0': ['J', '|', 'L'],
        '0,-1': ['L', '-', 'F'],
    },
    '|': {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': [],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': [],
    },
    '-': {
        '-1,0': [],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': [],
        '0,-1': ['L', '-', 'F', 'S'],
    },
    '7': {
        '-1,0': [],
        '0,1': [],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': ['L', '-', 'F', 'S'],
    },
    J: {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': [],
        '1,0': [],
        '0,-1': ['L', '-', 'F', 'S'],
    },
    L: {
        '-1,0': ['7', '|', 'F', 'S'],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': [],
        '0,-1': [],
    },
    F: {
        '-1,0': [],
        '0,1': ['J', '-', '7', 'S'],
        '1,0': ['J', '|', 'L', 'S'],
        '0,-1': [],
    },
    '.': {
        '-1,0': [],
        '0,1': [],
        '1,0': [],
        '0,-1': [],
    },
};

const nextDirectionTable: Record<Direction, DirectionNumber[]> = {
    '-1,0': [
        [0, -1],
        [-1, 0],
        [0, 1],
    ],
    '0,1': [
        [-1, 0],
        [0, 1],
        [1, 0],
    ],
    '1,0': [
        [0, 1],
        [1, 0],
        [0, -1],
    ],
    '0,-1': [
        [1, 0],
        [0, -1],
        [-1, 0],
    ],
};

const findStart = (matrix: Matrix): Position => {
    const index = matrix
        .map((line) => line.join(''))
        .join('')
        .indexOf('S');
    const rowLength = matrix[0].length;

    return { x: Math.floor(index / rowLength), y: index % rowLength, type: 'S' };
};

const isValidTransition = (originNodeType: Node, newNodeType: Node, direction: DirectionNumber): boolean => {
    if (originNodeType === '.') return false;

    return !!transitions?.[originNodeType]?.[direction.join(',')]?.includes(newNodeType);
};

const getNextDirection = (matrix: Matrix, nextNode: Position, originDirection: DirectionNumber) => {
    const possibleDirections = nextDirectionTable[originDirection.join(',') as Direction];

    return possibleDirections.find((direction) => {
        const possibleType = matrix?.[nextNode.x + direction[0]]?.[nextNode.y + direction[1]];

        return isValidTransition(nextNode.type, possibleType, direction);
    });
};

const getPath = (matrix: Matrix, direction: DirectionNumber, startNode: Position) => {
    let currentDirection = direction;
    const path = [startNode];
    let isCompletePath = false;

    while (true) {
        const currentNode = path[path.length - 1];

        const nextNode = {
            x: currentNode.x + currentDirection[0],
            y: currentNode.y + currentDirection[1],
            type: matrix?.[currentNode.x + currentDirection[0]]?.[currentNode.y + currentDirection[1]],
        };

        if (nextNode.type === 'S') {
            isCompletePath = true;
            break;
        }

        if (nextNode.type === '.' || !isValidTransition(currentNode.type, nextNode.type, currentDirection)) {
            break;
        }

        const nextDirection = getNextDirection(matrix, nextNode, currentDirection);

        if (!nextDirection) {
            break;
        }

        currentDirection = nextDirection;
        path.push(nextNode);
    }

    return { path, isCompletePath };
};

const getCompletePath = (matrix: Matrix): Position[] => {
    const startNode: Position = findStart(matrix);

    const start: DirectionNumber[] = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
    ];

    // north, south, east and west paths from start node
    const completePath = start
        .map((direction) => {
            const { path, isCompletePath } = getPath(matrix, direction, startNode);

            if (!isCompletePath) return false;

            return { firstDirection: direction, path };
        })
        .filter(Boolean)?.[0] || { path: [] as Position[] };

    return completePath.path;
};

const isPathNode = (completePath: Position[], node: Position) => {
    return !!completePath.find((pathNode) => pathNode.x === node.x && pathNode.y === node.y);
};

const getSanitizedMatrix = (matrix: Matrix, completePath: Position[]): Matrix => {
    return matrix.map((line, x) => {
        return line.map((type, y) => {
            const node: Position = { x, y, type: '.' };

            if (!isPathNode(completePath, node)) {
                return '.';
            }

            return type;
        });
    });
};

const getIntersections = (subPath: Node[]) => {
    let lastIntersection: Node = undefined;

    return subPath.reduce((acc, n) => {
        if (lastIntersection === 'F') {
            if (n === '7') {
                lastIntersection = undefined;
                return acc + 1;
            }

            if (n === 'J') {
                lastIntersection = undefined;
            }

            return acc;
        }

        if (lastIntersection === 'L') {
            if (n === 'J') {
                lastIntersection = undefined;
                return acc + 1;
            }

            if (n === '7') {
                lastIntersection = undefined;
            }

            return acc;
        }

        if (n === '|') {
            return acc + 1;
        }

        if (n === 'F' || n === 'L') {
            lastIntersection = n;
            return acc + 1;
        }

        return acc;
    }, 0);
};

const isNodeInsidePath = (sanitizedMatrix: Matrix, completePath: Position[], node: Position) => {
    if (isPathNode(completePath, node)) return false;

    const { x, y } = node;

    const leftIntersections = getIntersections(sanitizedMatrix[x].slice(0, y));
    const rightIntersections = getIntersections(sanitizedMatrix[x].slice(y + 1, sanitizedMatrix[x].length));

    return leftIntersections % 2 === 1 && rightIntersections % 2 === 1;
};

const getInsideNodes = (sanitizedMatrix: Matrix, completePath: Position[]): number => {
    return sanitizedMatrix.reduce((accMatrix, line, x) => {
        const insideNodes = line.reduce((accLine, node, y) => {
            const currentNode: Position = { x, y, type: '.' };

            return isNodeInsidePath(sanitizedMatrix, completePath, currentNode) ? accLine + 1 : accLine;
        }, 0);

        return accMatrix + insideNodes;
    }, 0);
};

export const solution = (matrix: Matrix): number => {
    const completePath = getCompletePath(matrix);
    const sanitizedMatrix = getSanitizedMatrix(matrix, completePath);

    return getInsideNodes(sanitizedMatrix, completePath);
};
