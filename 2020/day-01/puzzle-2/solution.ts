export const processData = (data: Buffer): number[] => {
    return data.toString().split('\n').map(Number);
};

export const solution = (input: number[]): number => {
    let numberA, numberB, numberC;

    input.forEach((a, indexA) => {
        input.forEach((b, indexB) => {
            input.forEach((c, indexC) => {
                if (indexA !== indexB && indexB !== indexC && indexA !== indexC && a + b + c === 2020) {
                    numberA = a;
                    numberB = b;
                    numberC = c;
                    return;
                }
            });
            if (numberA && numberB && numberC) return;
        });
        if (numberA && numberB && numberC) return;
    });

    return numberA * numberB * numberC;
};
