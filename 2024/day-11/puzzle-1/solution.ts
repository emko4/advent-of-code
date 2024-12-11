export const processData = (data: Buffer): number[] => {
    return data.toString().split(' ').map(Number);
};

export const solution = (input: number[]): number => {
    const blinks = 25;

    let stones = [...input];

    for (let i = 0; i < blinks; i++) {
        stones = stones
            .map((stone) => {
                if (stone === 0) return 1;

                const stoneText = '' + stone;
                if (stoneText.length % 2 === 0) {
                    return [
                        Number(stoneText.substring(0, stoneText.length / 2)),
                        Number(stoneText.substring(stoneText.length / 2)),
                    ];
                }

                return stone * 2024;
            })
            .flat();
    }

    return stones.length;
};
