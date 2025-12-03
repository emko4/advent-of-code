export const processData = (data: Buffer): Array<[number, number]> => {
    return data
        .toString()
        .split(',')
        .map((range) => {
            const [a, b] = range.split('-');

            return [Number(a), Number(b)];
        });
};

const concatNumbers = (number: number, times: number): number => {
    let result = '';
    for (let i = 0; i < times; i += 1) {
        result += number;
    }
    return Number(result);
};

export const solution = (input: Array<[number, number]>): number => {
    return input.reduce((acc, [a, b]) => {
        const aText = '' + a;
        const bText = '' + b;

        const MAX_PART_LENGTH = Math.floor(bText.length / 2);

        const invalidIDs = new Set<number>();
        for (let part = 1; part < Math.pow(10, MAX_PART_LENGTH); part += 1) {
            const partString = part.toString();

            if (aText.length % partString.length === 0 && aText.length / partString.length > 1) {
                const id = concatNumbers(part, aText.length / partString.length);

                if (id >= a && id <= b) invalidIDs.add(id);
            }

            if (bText.length % partString.length === 0 && bText.length / partString.length > 1) {
                const id = concatNumbers(part, bText.length / partString.length);

                if (id >= a && id <= b) invalidIDs.add(id);
            }
        }

        const sum = [...invalidIDs].reduce((setAcc, num) => setAcc + num, 0);

        return acc + sum;
    }, 0);
};
