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

if [ ! -d "$year" ];
then
  mkdir "$year"
fi

if [ ! -d "$year/day$paddedDay-$puzzle" ]; then
  mkdir "$year/day$paddedDay-$puzzle"
else
  echo "Puzzle already exists for this day!"
  exit 1
fi

indexFile="$year/day$paddedDay-$puzzle/index.run.ts"
testFile="$year/day$paddedDay-$puzzle/index.test.ts"
inputFile="$year/day$paddedDay-$puzzle/input.txt"
inputExampleFile="$year/day$paddedDay-$puzzle/inputExample.txt"
inputExampleResultFile="$year/day$paddedDay-$puzzle/inputExampleResult.txt"

touch $indexFile
touch $testFile
touch $inputFile
touch $inputExampleFile
touch $inputExampleResultFile

cat template/index.run.ts > $indexFile
sed -e "s/<<year>>/$year/" -e "s/<<day>>/$paddedDay/" -e "s/<<puzzle>>/$puzzle/" template/index.test.ts > $testFile
cat template/input.txt > $inputFile
cat template/inputExample.txt > $inputExampleFile
cat template/inputExampleResult.txt > $inputExampleResultFile

git add "$indexFile" "$testFile"

exit 0