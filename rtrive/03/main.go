package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func secondTest(text []string, inputLength int, initIndex int, oxigen bool) []string {
	var count0, count1 int
	var tmp0, tmp1 []string
	if len(text) == 1 {
		return text
	}
	for _, each_ln := range text {
		if each_ln[initIndex] == 49 {
			count1++
			tmp1 = append(tmp1, each_ln)
		} else {
			count0++
			tmp0 = append(tmp0, each_ln)
		}
	}
	if oxigen {
		if count1 > count0 {
			return secondTest(tmp1, inputLength, initIndex+1, oxigen)
		} else if count1 < count0 {
			return secondTest(tmp0, inputLength, initIndex+1, oxigen)
		}
	} else {
		if count1 < count0 {
			return secondTest(tmp1, inputLength, initIndex+1, oxigen)
		} else if count1 > count0 {
			return secondTest(tmp0, inputLength, initIndex+1, oxigen)
		}
	}
	if oxigen {
		return secondTest(tmp1, inputLength, initIndex+1, oxigen)
	}
	return secondTest(tmp0, inputLength, initIndex+1, oxigen)
}

func main() {
	fmt.Println("Day 03")
	// var count1, count0 int
	// var gammaRate, epsilonRate string

	// Read file
	f, _ := os.Open("./input.txt")
	scanner := bufio.NewScanner(f)
	scanner.Split(bufio.ScanLines)
	var text []string
	for scanner.Scan() {
		text = append(text, scanner.Text())
	}
	f.Close()

	// First part
	var count0, count1 int
	var gammaRate, epsilonRate string
	inputLength := len(text[0])
	for i := 0; i < inputLength; i++ {
		for _, each_ln := range text {
			if each_ln[i] == 49 {
				count1++
			} else {
				count0++
			}
		}
		if count1 > count0 {
			gammaRate = gammaRate + "1"
			epsilonRate = epsilonRate + "0"
		} else {
			gammaRate = gammaRate + "0"
			epsilonRate = epsilonRate + "1"
		}
		count1 = 0
		count0 = 0
	}
	gammaRateInt, _ := strconv.ParseInt(gammaRate, 2, 64)
	epsilonRateInt, _ := strconv.ParseInt(epsilonRate, 2, 64)
	fmt.Println(gammaRateInt * epsilonRateInt)

	// Second part

	oxigenOutput := secondTest(text, inputLength, 0, true)
	notOxigenOutput := secondTest(text, inputLength, 0, false)
	oxigenOutputInt, _ := strconv.ParseInt(oxigenOutput[0], 2, 64)
	notOxigenOutputInt, _ := strconv.ParseInt(notOxigenOutput[0], 2, 64)
	fmt.Println(oxigenOutputInt * notOxigenOutputInt)

}
