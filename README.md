# advent-of-code

## Dependencies install

Not surprisingly, to start off, install the dependencies

`npm install`

## Create puzzle folder

`npm run generate <year> <day> <puzzle>`

- year   - AoC year in `yyyy` format
- day    - number of day, number is automatically padded with 0
- puzzle - 1 or 2, optional parameter - 1 is default value

Example: `npm run generate 2024 3 2`

## Use watch mode for puzzle

Copy the example input of the puzzle to the `inputExample.txt` file and the example result to the `inputExampleResult.txt` file.

Then, run the following command and develop your solution until the test passes.

`npm run watch <year> <day> <puzzle>`

- year   - AoC year in `yyyy` format
- day    - number of day, number is automatically padded with 0
- puzzle - 1 or 2, optional parameter - 1 is default value

Example: `npm run watch 2024 3 2`

## Get the result of puzzle

Once you have the correct solution from watch mode, run it with the following command to get your answer!

`npm run result <year> <day> <puzzle>`

- year   - AoC year in `yyyy` format
- day    - number of day, number is automatically padded with 0
- puzzle - 1 or 2, optional parameter - 1 is default value

Example: `npm run result 2024 3 2`