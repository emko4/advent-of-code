#!/bin/sh

inputFileDirectoryRegex=".*/[0-9][0-9][0-9][0-9]/day-[0-9][0-9]"
exampleFilesDirectoryRegex=".*/[0-9][0-9][0-9][0-9]/day-[0-9][0-9]/puzzle-[0-9]"

find "." -type d -regex "$inputFileDirectoryRegex" | while read -r dir; do
    inputFile="$dir/input.txt"

    if [ ! -f "$inputFile" ]; then
      touch $inputFile
      cat template/input.txt > $inputFile
    fi
done

find "." -type d -regex "$exampleFilesDirectoryRegex" | while read -r dir; do
    exampleInputFile="$dir/example-input.txt"
    exampleResultFile="$dir/example-result.txt"

    if [ ! -f "$exampleInputFile" ]; then
      touch $exampleInputFile
      cat template/example-input.txt > $exampleInputFile
    fi

    if [ ! -f "$exampleResultFile" ]; then
      touch $exampleResultFile
      cat template/example-result.txt > $exampleResultFile
    fi
done

exit 0