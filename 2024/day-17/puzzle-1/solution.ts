type Register = number;
type Registers = [Register, Register, Register];
type OptCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Program = OptCode[];

type OperationOutput = { registers?: Registers; output?: string; pointer?: number };

type Input = {
    registers: Registers;
    program: Program;
};

export const processData = (data: Buffer): Input => {
    const [registers, program] = data.toString().split('\n\n');

    return {
        registers: registers
            .split('\n')
            .map((register) => register.match(/\d+/)?.[0])
            .map(Number) as Registers,
        program: program.split(' ')[1].split(',').map(Number) as Program,
    };
};

const getOperandValue = (registers: Registers, operand: OptCode): number => {
    switch (operand) {
        case 0:
            return 0;
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return registers[0];
        case 5:
            return registers[1];
        case 6:
            return registers[2];
        case 7:
        default:
            console.log('This should not happen');
    }
};

const doOperation = (operation: OptCode, operand: OptCode, registers: Registers): OperationOutput => {
    console.log('Operation: ', operation, ' operand: ', operand, 'registers: ', registers);

    const [A, B, C] = registers;

    if (operation === 0) {
        const value = getOperandValue(registers, operand);
        return { registers: [Math.floor(A / Math.pow(2, value)), B, C] };
    }

    if (operation === 1) {
        return { registers: [A, B ^ operand, C] };
    }

    if (operation === 2) {
        const value = getOperandValue(registers, operand);
        return { registers: [A, value % 8 & 0b111, C] };
    }

    if (operation === 3) {
        return { pointer: A !== 0 ? operand : undefined };
    }

    if (operation === 4) {
        return { registers: [A, B ^ C, C] };
    }

    if (operation === 5) {
        const value = getOperandValue(registers, operand);
        return { output: (value % 8).toString() };
    }

    if (operation === 6) {
        const value = getOperandValue(registers, operand);
        return { registers: [A, Math.floor(A / Math.pow(2, value)), C] };
    }

    if (operation === 7) {
        const value = getOperandValue(registers, operand);
        return { registers: [A, B, Math.floor(A / Math.pow(2, value))] };
    }

    return {};
};

export const solution = (input: Input): string => {
    let currentRegisters: Registers = [...input.registers];
    let outputCollector = '';
    for (let i = 0; i < input.program.length; i += 2) {
        const operation = input.program[i];
        const combo = input.program[i + 1];

        const {
            registers = currentRegisters,
            output = '',
            pointer = i,
        } = doOperation(operation, combo, currentRegisters);

        if (pointer !== i) i = pointer - 2;
        currentRegisters = registers;
        outputCollector += output;
    }

    return outputCollector.split('').join(',');
};
