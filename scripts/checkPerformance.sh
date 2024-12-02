#!/bin/sh

year=$1;
day=$2;
puzzle=$3;

runHyperfineCommand() {
  local runFile=$1

  local command="hyperfine --warmup 3 -N \"bun $runFile\""
  echo "Run $command"
  eval $command
}

if [ -z "$year" ]; then
    echo "Year is mandatory!"
    exit 1
fi

if [ -z "$day" ]; then
    echo "Day is mandatory!"
    exit 1
fi

paddedDay=$(printf '%02d\n' "$day")

if [ -z "$puzzle" ]; then
    runFile1="$year/day-$paddedDay/puzzle-1/index.run.ts"

    if [ ! -f "$runFile1" ]; then
        echo "Run file for puzzle $year/day-$paddedDay/puzzle-1 doesn't exist!"
    else
        runHyperfineCommand $runFile1
    fi

    runFile2="$year/day-$paddedDay/puzzle-2/index.run.ts"

    if [ ! -f "$runFile2" ]; then
        echo "Run file for puzzle $year/day-$paddedDay/puzzle-2 doesn't exist!"
    else
        runHyperfineCommand $runFile2
    fi

    if [[ ! -f "$runFile1" && ! -f "$runFile2" ]]; then
        exit 1
    else
        exit 0
    fi
fi

if [[ "$puzzle" != "1" && "$puzzle" != "2" ]]; then
    echo "Puzzle could be only 1 or 2!"
    exit 1
fi

runFile="$year/day-$paddedDay/puzzle-$puzzle/index.run.ts"

if [ ! -f "$runFile" ]; then
    echo "Run file for puzzle $year/day-$paddedDay/puzzle-$puzzle doesn't exist!"
    exit 1
fi

runHyperfineCommand $runFile

exit 0
