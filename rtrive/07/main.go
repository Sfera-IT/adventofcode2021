package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

func readFile(path string) []int {
	f, _ := os.Open("./input.txt")
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	tmp := scanner.Text()
	tmp2 := strings.Split(tmp, ",")
	var numbers []int
	for _, val := range tmp2 {
		tmpNumber, _ := strconv.Atoi(val)
		numbers = append(numbers, tmpNumber)
	}
	return numbers
}

func sumElementArray(numbers []int) int {
	var sum int
	for _, val := range numbers {
		sum += val
	}
	return sum
}

func main() {
	numbers := readFile("./input.txt")
	var partialValues, partialValues2 []int
	var result, result2 int

	for i, _ := range numbers {
		for _, z := range numbers {
			diff := int(math.Abs(float64(i - z)))
			diff2 := int(math.Abs(float64(i - z)))
			partialValues = append(partialValues, diff)
			partialValues2 = append(partialValues2, diff2*(diff2+1)/2)
		}
		if i == 0 {
			result = sumElementArray(partialValues)
			result2 = sumElementArray(partialValues2)
		}
		if result > sumElementArray(partialValues) {
			result = sumElementArray(partialValues)
		}
		if result2 > sumElementArray(partialValues2) {
			result2 = sumElementArray(partialValues2)
		}
		partialValues = []int(nil)
		partialValues2 = []int(nil)
	}
	fmt.Println(result)
	fmt.Println(result2)
}
