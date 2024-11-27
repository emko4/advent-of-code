export const processData = (data: Buffer): string[] => {
    return data.toString().split('\n');
};

const NumberRegexStart = /(one|two|three|four|five|six|seven|eight|nine|\d).*$/;
const NumberRegexEnd = /^.*(one|two|three|four|five|six|seven|eight|nine|\d)/;

const NUMBER_MAP = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };

const getNumber = (input: string): string => {
    if (NUMBER_MAP[input]) {
        return `${NUMBER_MAP[input]}`;
    }

    return input;
};

export const solution = (input: string[]): number => {
    return input.reduce((acc, line) => {
        const firstNumber = getNumber(line.match(NumberRegexStart)?.[1]);
        const lastNumber = getNumber(line.match(NumberRegexEnd)?.[1]);

        return acc + Number(`${firstNumber}${lastNumber}`);
    }, 0);
};
