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
    path: string[];
};

const solveMachine = (machine: Machine): number => {
    const graph: Record<string, Set<string>> = {};

    const startState = Array(machine.joltage.length).fill('0').join(',');

    console.log('[DEV]', 'Building graph');
    const queueGraph: string[] = [startState];
    while (queueGraph.length > 0) {
        const state = queueGraph.shift();

        const nextStates: string[] = machine.steps.reduce((acc, step) => {
            const nextState = getNextState(state, step);

            if (!isJoltageInRange(nextState, machine.joltage)) return acc;

            if (!graph[nextState] && !queueGraph.includes(nextState)) queueGraph.push(nextState);

            return [...acc, nextState];
        }, []);

        graph[state] = new Set<string>(nextStates);
    }

    console.log('[DEV]', 'Find shortest path');
    const queue: QueueItem[] = [{ state: startState, path: [] }];
    const visited: Set<string> = new Set();
    const finalJoltage = machine.joltage.join(',');

    while (queue.length > 0) {
        const { state, path } = queue.shift();

        if (state === finalJoltage) return path.length;

        if (visited.has(state)) continue;
        visited.add(state);

        const neighbors = graph[state];
        neighbors.forEach((nextState) => {
            queue.push({ state: nextState, path: [...path, nextState] });
        });
    }

    return 0;
};

export const solution = (machines: Machine[]): number => {
    return machines.reduce((acc, machine, index) => {
        console.log('[DEV]', `Solving machine ${index + 1}/${machines.length}`);
        return acc + solveMachine(machine);
    }, 0);
};
