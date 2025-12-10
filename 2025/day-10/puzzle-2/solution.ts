type Machine = {
    state: string;
    steps: string[];
    joltage: number[];
};

export const processData = (data: Buffer): Machine[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            const items = line.split(' ');

            const state = items[0].slice(1, items[0].length - 1);

            const steps = items.slice(1, items.length - 1).map((step) =>
                step
                    .slice(1, step.length - 1)
                    .split(',')
                    .join(''),
            );

            const joltage = items[items.length - 1]
                .slice(1, items[items.length - 1].length - 1)
                .split(',')
                .map(Number);

            return { state, steps, joltage };
        });
};

const getNextState = (state: string, step: string) => {
    const stateArray = state.split(',').map(Number);

    step.split('').forEach((s) => {
        stateArray[Number(s)] += 1;
    });

    return stateArray.join(',');
};

const isJoltageInRange = (state: string, joltage: number[]): boolean => {
    return state.split(',').every((s, index) => Number(s) <= joltage[index]);
};

type QueueItem = {
    state: string;
    pathCounter: number;
    heuristic: number;
};

function heuristicFunction(state: string, target: string, maxCover: number): number {
    let remainIncrements = 0;
    const stateArray = state.split(',');
    const targetArray = target.split(',');

    for (let i = 0; i < targetArray.length; i++) remainIncrements += Number(targetArray[i]) - Number(stateArray[i]);

    return Math.ceil(remainIncrements / maxCover);
}

const solveMachine = (machine: Machine): number => {
    const { steps, joltage } = machine;

    const startState = Array(joltage.length).fill('0').join(',');
    const finalJoltage = joltage.join(',');

    const coverage = steps.map((b) => b.split('').reduce((acc, x) => (Number(x) === 0 ? acc : acc + 1), 0));
    const maxCover = Math.max(...coverage);

    const queue: QueueItem[] = [
        { state: startState, pathCounter: 0, heuristic: heuristicFunction(startState, finalJoltage, maxCover) },
    ];
    const cache: Record<string, number> = { [startState]: 0 };

    while (queue.length > 0) {
        queue.sort((a, b) => a.heuristic - b.heuristic);
        const { state, pathCounter } = queue.shift();

        if (state === finalJoltage) return pathCounter;

        for (const step of steps) {
            const nextState = getNextState(state, step);

            if (!isJoltageInRange(nextState, joltage)) continue;

            const newPathCounter = pathCounter + 1;

            if (!cache[nextState] || cache[nextState] > newPathCounter) {
                cache[nextState] = newPathCounter;

                queue.push({
                    state: nextState,
                    pathCounter: newPathCounter,
                    heuristic: newPathCounter + heuristicFunction(nextState, finalJoltage, maxCover),
                });
            }
        }
    }

    return 0;
};

export const solution = (machines: Machine[]): number => {
    return machines.reduce((acc, machine, index) => {
        console.log('[DEV]', `Solving machine ${index + 1}/${machines.length}`);
        return acc + solveMachine(machine);
    }, 0);
};
