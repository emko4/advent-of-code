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

const moveData = (input: Block[]): Block[] => {
    let blocks = [...input];
    let lastDataType = Infinity;

    for (let i = blocks.length - 1; i >= 0; i -= 1) {
        // if block is not free space and processing id is in correct order
        if (blocks[i] !== '.' && Number(blocks[i]) < lastDataType) {
            // save processed id
            lastDataType = Number(blocks[i]);

            // find block id occurrence
            let fragmentLength = 0;
            while (blocks[i] === lastDataType) {
                fragmentLength++;
                i -= 1;
            }

            // correct current index
            i += 1;

            // find first possible free space for fragment
            let spaceIndex = -1;
            let spaceLength = 0;
            for (let x = 0; x < i; x++) {
                // space is found
                if (spaceLength === fragmentLength) {
                    break;
                }

                // process existing space
                if (blocks[x] === '.') {
                    // save index of possible space
                    if (spaceIndex === -1) spaceIndex = x;

                    spaceLength += 1;
                    continue;
                }

                // reset when file occurred
                if (blocks[x] !== '.') {
                    spaceIndex = -1;
                    spaceLength = 0;
                }
            }

            // if space is found and has correct length, move data
            if (spaceIndex !== -1 && spaceLength === fragmentLength) {
                for (let x = 0; x < fragmentLength; x++) {
                    blocks[spaceIndex + x] = lastDataType;
                    blocks[i + x] = '.';
                }
            }
        }
    }

    return blocks;
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
