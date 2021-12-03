package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func readInput() {

}

func main() {
	var count, previous int
	f, _ := os.OpenFile("input.txt", os.O_RDWR, 0400)
	var numbers []int
	scanner := bufio.NewScanner(f)
	scanner.Scan()
	previous, _ = strconv.Atoi(scanner.Text())
	numbers = append(numbers, previous)
	// First
	for scanner.Scan() {
		lineStr := scanner.Text()
		num, _ := strconv.Atoi(lineStr)
		if num > previous {
			count++
		}
		previous = num
		numbers = append(numbers, num)
	}
	fmt.Println(count)

	count = 0
	// Second
	previous = numbers[0] + numbers[1] + numbers[2]
	for i := 0; i < len(numbers); i++ {
		sum := 0
		if i < len(numbers)-2 {
			for z := 0; z < 3; z++ {
				sum = sum + numbers[z+i]
			}
			fmt.Println(previous, sum)
			if sum > previous {
				count++
			}
			previous = sum
		}
	}
	fmt.Println(count)
}
