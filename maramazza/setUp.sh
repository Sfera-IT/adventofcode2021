#!/bin/bash

AOC_SESSION=$(<session.txt)
day=${1:-$(TZ='Europe/Rome' date +%-d)}
year=${2:-$(date +%Y)}

mkdir $day
inputFileName=${day}.txt
curl https://adventofcode.com/${year}/day/${day}/input --cookie session="${AOC_SESSION}" >> ${day}/${inputFileName}

pyFileName=${day}.py
touch  ${day}/${pyFileName}
open -a Visual\ Studio\ Code\ -\ Insiders 3 .
open -a Visual\ Studio\ Code\ -\ Insiders 3 ${day}/${pyFileName}
open -a Visual\ Studio\ Code\ -\ Insiders 3 ${day}/${inputFileName}

open https://adventofcode.com/${year}/day/${day}
