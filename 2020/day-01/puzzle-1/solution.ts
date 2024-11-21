export const processData = (data: Buffer): number[] => {
    return data.toString().split('\n').map(Number);
};

export const solution = (input: number[]): number => {
    let numberA, numberB;

    input.forEach((a, indexA) => {
        input.forEach((b, indexB) => {
            if (indexA !== indexB && a + b === 2020) {
                numberA = a;
                numberB = b;
                return;
            }
        });

        if (numberA && numberB) return;
    });

    return numberA * numberB;
};
