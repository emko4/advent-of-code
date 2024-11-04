#!/bin/sh

year=$1;
day=$2;
puzzle=$3;

if [ -z "$year" ]; then
    echo "Year is mandatory!"
    exit 1
fi

if [ -z "$day" ]; then
    echo "Day is mandatory!"
    exit 1
fi

if [ -z "$puzzle" ]; then
    puzzle=1
fi

if [[ "$puzzle" != "1" && "$puzzle" != "2" ]]; then
    echo "Puzzle could be only 1 or 2!"
    exit 1
fi

paddedDay=$(printf '%02d\n' "$day")

runFile="$year/day$paddedDay-$puzzle/index.run.ts"

if [ ! -f "$runFile" ]; then
    echo "Run file for puzzle $year/day$paddedDay-$puzzle doesn't exist!"
    exit 1;
fi

echo "Running file: $runFile\n"

ts-node "$runFile"

exit 0