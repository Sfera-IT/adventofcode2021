package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	fmt.Println("Advent of code day 2")

	// Read file
	f, _ := os.Open("./input.txt")
	scanner := bufio.NewScanner(f)
	scanner.Split(bufio.ScanLines)
	var text []string
	for scanner.Scan() {
		text = append(text, scanner.Text())
	}
	f.Close()

	// Compute depth and horizontal
	var depth, horizontal, aim int
	for _, each_ln := range text {
		tmp := strings.Split(each_ln, " ")
		value, _ := strconv.Atoi(tmp[1])
		switch tmp[0] {
		case "forward":
			horizontal = horizontal + value
			depth = depth + aim*value
		case "up":
			aim = aim - value
		case "down":
			aim = aim + value
		}
	}
	fmt.Println(depth * horizontal)
}
