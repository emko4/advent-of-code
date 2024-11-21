export const processData = (data: Buffer): any => {
    return data.toString();
};

export const solution = (input: any): any => {
    let counter = 0;
    const index = input.split('').findIndex((char) => {
        if (char === '(') counter += 1;
        if (char === ')') counter -= 1;

        return counter < 0;
    });

    return index + 1;
};
