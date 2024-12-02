# advent-of-code

## Dependencies install

Not surprisingly, to start off, install the dependencies

`npm install`

And `postinstall` will create all the missing `txt` files that should not be pushed to the repository.

## Create puzzle folder

`npm run generate <year> <day> <puzzle>`

- **year**: The Advent of Code year, in `yyyy` format
- **day**: The day number, automatically zero-padded if necessary
- **puzzle**: Either `1` or `2`. This is an optional parameter; the default value is `1`.

**Example:**
- `npm run generate 2024 3 2`

## Use watch mode for puzzle

Copy the example input of the puzzle to the `example-input.txt` file and the example result to the `example-result.txt` file.

Then, run the following command and develop your solution in the `solution.ts` file until the test passes.

`npm run watch <year> <day> <puzzle>`

- **year**: The Advent of Code year, in `yyyy` format
- **day**: The day number, automatically zero-padded if necessary
- **puzzle**: Either `1` or `2`. This is an optional parameter; the default value is `1`.

**Example:**
- `npm run watch 2024 3 2`

## Get the result of puzzle

Copy the input of the puzzle to the `input.txt` file (same for all puzzles of the day).

Once you have the correct solution from watch mode, run it with the following command to get your answer!

`npm run result <year> <day> <puzzle>`

- **year**: The Advent of Code year, in `yyyy` format
- **day**: The day number, automatically zero-padded if necessary
- **puzzle**: Either `1` or `2`. This is an optional parameter; the default value is `1`.

**Example:**
- `npm run result 2024 3 2`

## Get the performance of puzzle

This command uses the `hyperfine` benchmarking [tool](https://github.com/sharkdp/hyperfine) under the hood, so make sure it is installed.

`npm run performance <year> <day> <puzzle>`

- **year**: The Advent of Code year, in `yyyy` format
- **day**: The day number, automatically zero-padded if necessary
- **puzzle**: Either `1` or `2`. This is an optional parameter; if omitted, both puzzles will be checked

**Examples:**
- `npm run performance 2024 3 2`
- `npm run performance 2024 3`