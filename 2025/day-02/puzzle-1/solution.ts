export const processData = (data: Buffer): Array<[number, number]> => {
    return data
        .toString()
        .split(',')
        .map((range) => {
            const [a, b] = range.split('-');

            return [Number(a), Number(b)];
        });
};

export const solution = (input: Array<[number, number]>): number => {
    return input.reduce((acc, [a, b]) => {
        const aText = '' + a;

        let part = Number(aText.slice(0, Math.max(Math.floor(aText.length / 2), 1)));
        if (aText.length % 2 === 1) {
            part = Math.pow(10, part.toString().length - 1);
        }

        let rangeResult = 0;
        while (Number(`${part}${part}`) <= b) {
            if (Number(`${part}${part}`) >= a) {
                rangeResult += Number(`${part}${part}`);
            }

            part += 1;
        }

        return acc + rangeResult;
    }, 0);
};
