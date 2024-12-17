type Button = { x: number; y: number };
type Prize = { x: number; y: number };

type Machine = { A: Button; B: Button; prize: Prize };

const MAX_PUSH = 100;

export const processData = (data: Buffer): Machine[] => {
    return data
        .toString()
        .split('\n\n')
        .map((machine) => {
            const [A, B, prize] = machine.split('\n');

            const [ax, ay] = A.matchAll(/\d+/g);
            const [bx, by] = B.matchAll(/\d+/g);
            const [px, py] = prize.matchAll(/\d+/g);

            return {
                A: { x: Number(ax[0]), y: Number(ay[0]) },
                B: { x: Number(bx[0]), y: Number(by[0]) },
                prize: { x: Number(px[0]), y: Number(py[0]) },
            };
        }) as Machine[];
};

const getCombinationString = (a: number, b: number): string => a + ',' + b;

const checkMachine = (machine: Machine): number => {
    const { A, B, prize } = machine;

    // get combinations fox x coordinate
    let xCombinationTokens = new Set<string>();
    for (let i = 0; i < MAX_PUSH; i++) {
        for (let j = 0; j < MAX_PUSH; j++) {
            if (A.x * i + B.x * j === prize.x) {
                xCombinationTokens.add(getCombinationString(i, j));
            }
        }
    }

    // get combinations fox y coordinate
    let yCombinationTokens = new Set<string>();
    for (let i = 0; i < MAX_PUSH; i++) {
        for (let j = 0; j < MAX_PUSH; j++) {
            if (A.y * i + B.y * j === prize.y) {
                yCombinationTokens.add(getCombinationString(i, j));
            }
        }
    }

    // find if there is same combination for both coordinates
    const intersection = xCombinationTokens.intersection(yCombinationTokens);

    // if there is more combinations, get the one with minimum tokens
    const minTokens = Math.min(
        ...Array.from(intersection).map((combination) => {
            const [a, b] = combination.split(',').map(Number);
            return a * 3 + b;
        }),
    );

    // return 0 if combination does not exist
    return minTokens < Infinity ? minTokens : 0;
};

export const solution = (input: Machine[]): number => {
    return input.reduce((acc, machine) => {
        return acc + checkMachine(machine);
    }, 0);
};
