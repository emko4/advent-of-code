type Button = { x: number; y: number };
type Prize = { x: number; y: number };

type Machine = { A: Button; B: Button; prize: Prize };

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
                prize: { x: Number(px[0]) + 10000000000000, y: Number(py[0]) + 10000000000000 },
            };
        }) as Machine[];
};

const checkMachine = (machine: Machine): number => {
    const { A, B, prize } = machine;

    const { x: ax, y: ay } = A;
    const { x: bx, y: by } = B;
    const { x, y } = prize;

    const delta = ax * by - bx * ay;

    if (delta !== 0) {
        const a = (by * x - bx * y) / delta;
        const b = (ax * y - ay * x) / delta;

        return Number.isInteger(a) && Number.isInteger(b) ? a * 3 + b : 0;
    }

    return 0;
};

export const solution = (input: Machine[]): number => {
    return input.reduce((acc, machine) => {
        return acc + checkMachine(machine);
    }, 0);
};
