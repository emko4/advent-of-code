type Reveal = { red: number; green: number; blue: number };
type Game = Reveal[];

export const processData = (data: Buffer): Game[] => {
    return data
        .toString()
        .split('\n')
        .map((line) => {
            return line
                .split(': ')[1]
                .split('; ')
                .map((cubes) => {
                    return cubes.split(', ').reduce(
                        (acc, cube) => {
                            const [number, color] = cube.split(' ');

                            return { ...acc, [color]: Number(number) };
                        },
                        { red: 0, green: 0, blue: 0 } as Reveal,
                    );
                });
        });
};

export const solution = (input: Game[]): number => {
    return input.reduce((acc, game) => {
        const { redMax, greenMax, blueMax } = game.reduce(
            (acc, { red, green, blue }) => {
                return {
                    redMax: Math.max(red, acc.redMax),
                    greenMax: Math.max(green, acc.greenMax),
                    blueMax: Math.max(blue, acc.blueMax),
                };
            },
            { redMax: 0, greenMax: 0, blueMax: 0 },
        );

        return redMax * greenMax * blueMax + acc;
    }, 0);
};
