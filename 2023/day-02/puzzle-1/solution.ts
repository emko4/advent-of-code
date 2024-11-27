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

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

export const solution = (input: Game[]): number => {
    return input.reduce((acc, game, index) => {
        const isPossible = game.every(
            ({ red, green, blue }) => red <= MAX_RED && green <= MAX_GREEN && blue <= MAX_BLUE,
        );

        return isPossible ? acc + index + 1 : acc;
    }, 0);
};
