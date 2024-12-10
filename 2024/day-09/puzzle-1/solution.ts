type Block = number | '.';

export const processData = (data: Buffer): number[] => {
    return data.toString().split('').map(Number);
};

const getBlocks = (input: number[]): Block[] => {
    let id = 0;
    return input.reduce((acc, number, index) => {
        if (index % 2 === 0) {
            return [...acc, ...Array(number).fill(id++)];
        }
        return [...acc, ...Array(number).fill('.')];
    }, [] as Block[]);
};

const moveData = (blocks: Block[]): Block[] => {
    const result: Block[] = Array(blocks.length).fill('.');

    let endIndex = blocks.length - 1;
    for (let i = 0; i < blocks.length; i++) {
        // if block is .
        if (blocks[i] === '.') {
            // start searching from last found number
            for (let j = endIndex; j > i; j--) {
                // find first number from current end
                if (blocks[j] !== '.') {
                    result[i] = blocks[j];
                    endIndex = j - 1;
                    break;
                }
            }
        }

        // if block is number and there is block to move
        if (blocks[i] !== '.' && endIndex >= i) {
            result[i] = blocks[i];
        }

        // stop cycle when all data are moved
        if (endIndex < i) break;
    }

    return result;
};

const getChecksum = (data: Block[]): number => {
    let checksum = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== '.') {
            checksum += i * (data[i] as number);
        }
    }
    return checksum;
};

export const solution = (input: number[]): number => {
    const blocks = getBlocks(input);

    const movedData = moveData(blocks);

    return getChecksum(movedData);
};
