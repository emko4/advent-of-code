// Inspired by Oliver's solution
// https://github.com/olivers-x/advent-of-code/blob/main/2025/10/part2.mjs

import Solver from 'javascript-lp-solver';

type Machine = {
    state: string;
    steps: string[];
    joltage: number[];
};

type Step = {
    id: number;
    name: string;
    cost: number;
    affects: string[];
};

type Joltages = Record<string, number>;

type ConstraintKey = 'min' | 'max' | 'equal';
type LPModel = {
    optimize: string;
    opType: 'min' | 'max';
    constraints: Record<string, Partial<Record<ConstraintKey, number>>>;
    variables: Record<string, Record<string, number>>;
    ints: Record<string, number>;
};

type Result = { result: number };

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

const solveMachine = async (machine: Machine): Promise<number> => {
    const joltages: Joltages = machine.joltage.reduce((acc, j, index) => ({ ...acc, [`a${index}`]: j }), {});
    const steps: Step[] = machine.steps.map((step, index) => ({
        id: index,
        name: step,
        cost: 1,
        affects: step.split('').map((s) => `a${s}`),
    }));

    const model: LPModel = {
        optimize: 'cost',
        opType: 'min',
        constraints: {},
        variables: {},
        ints: {},
    };

    Object.keys(joltages).forEach((key) => {
        model.constraints[key] = { equal: joltages[key] };
    });

    steps.forEach((step) => {
        const variableDefinition = { cost: step.cost };

        step.affects.forEach((a) => {
            variableDefinition[a] = 1;
        });

        model.variables[step.name] = variableDefinition;
        model.ints[step.name] = 1;
    });

    const result: Result = Solver.Solve(model);

    return result.result;
};

export const solution = async (machines: Machine[]): Promise<number> => {
    let result = 0;

    for (let i = 0; i < machines.length; i += 1) {
        console.log(`Machine ${i + 1}/${machines.length} result: ${result}`);
        result += await solveMachine(machines[i]);
    }

    return result;
};
