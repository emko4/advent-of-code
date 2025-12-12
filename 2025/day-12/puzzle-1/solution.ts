type Input = {
    gifts: Gift[];
    spaces: Space[];
};

type Gift = { place: string[][]; size: number };

type Space = {
    dimensions: { width: number; height: number };
    counts: number[];
};

export const processData = (data: Buffer): Input => {
    const allData = data.toString().split('\n\n');

    const gifts = allData.slice(0, allData.length - 1).map((group) => {
        const [, ...lines] = group.split('\n');

        const size = lines.reduce((acc, line) => acc + line.split('').filter((char) => char === '#').length, 0);

        return {
            place: lines.map((line) => line.split('')),
            size,
        };
    });

    const spaces = allData
        .slice(-1)[0]
        .split('\n')
        .map((space) => {
            const [dimensions, counts] = space.split(': ');
            const [width, height] = dimensions.split('x').map(Number);

            return { dimensions: { width, height }, counts: counts.split(' ').map(Number) };
        });

    return {
        gifts,
        spaces,
    };
};

const isSpacePossible = (space: Space, gifts: Gift[]): boolean => {
    const { counts } = space;

    const neededSpace = counts.reduce((acc, count, index) => acc + count * gifts[index].size, 0);

    return neededSpace <= space.dimensions.width * space.dimensions.height;
};

export const solution = (input: Input): number => {
    const { gifts, spaces } = input;

    return spaces.reduce((acc, space) => acc + (isSpacePossible(space, gifts) ? 1 : 0), 0);
};
