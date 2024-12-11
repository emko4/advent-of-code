type Memory = Record<number, Record<number, number>>;

export const processData = (data: Buffer): number[] => {
    return data.toString().split(' ').map(Number);
};

const blink = (stone: number, maxBlinks: number, memory: Memory, blinkCount: number = 0): number => {
    // stop recursion
    if (blinkCount === maxBlinks) return 1;

    // if we know count, use it
    if (memory?.[blinkCount]?.[stone] !== undefined) {
        return memory[blinkCount][stone];
    }

    // default rule
    let newStones: number[] = [stone * 2024];

    // rule for 1
    if (stone === 0) newStones = [1];

    // rule for even length of number
    const stoneText = '' + stone;
    if (stoneText.length % 2 === 0) {
        newStones = [
            Number(stoneText.substring(0, stoneText.length / 2)),
            Number(stoneText.substring(stoneText.length / 2)),
        ];
    }

    // do recursion
    const count = newStones.reduce((acc, s) => {
        const count = blink(s, maxBlinks, memory, blinkCount + 1);

        return acc + count;
    }, 0);

    // save count for future
    if (memory?.[blinkCount]?.[stone] === undefined) {
        if (memory[blinkCount] === undefined) memory[blinkCount] = {};

        memory[blinkCount][stone] = count;
    }

    return count;
};

export const solution = (input: number[]): number => {
    const blinks = 75;
    const memory: Memory = {};

    // run and count over whole input
    return input.reduce((acc, number) => {
        return acc + blink(number, blinks, memory);
    }, 0);
};
