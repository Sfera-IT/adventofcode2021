def main():
    with open("4.txt") as f:
        input = f.read().strip()
        input = input.split("\n\n")

    numbers = input[0].split(",")
    boards = [[row.split() for row in b.splitlines()] for b in input[1:]]

    p1 = part1(numbers, boards)
    p2 = part2(numbers, boards)

    print(f"part1: {p1}")
    print(f"part2: {p2}")

def markNumbers(boards, num):
    for b in boards:
        for r in b:
            for i, val in enumerate(r):
                if val == num:
                    r[i] = "X"

def checkForWin(board):
    return any(all(v == "X" for v in row) for row in board) or any(all(row[i] == "X" for row in board) for i in range(len(board)))

def checkAllBoards(boards):
    return [i for i, b in enumerate(boards) if checkForWin(b)]

def playGame(numbers, boards):
    for n in numbers:
        markNumbers(boards, n)
        winner = checkAllBoards(boards)

        if winner != []:
            return winner[0], n

def part1(numbers, boards):
    winnerIndex, winningNum = playGame(numbers, boards)

    winner = boards[winnerIndex]
    winnerSum = 0
    for row in winner:
        for val in row:
            if val != "X":
                winnerSum += int(val)

    return winnerSum * int(winningNum)

def part2(numbers, boards):
    winner, winningNum = playGameLast(numbers, boards)

    winnerSum = 0
    for row in winner:
        for val in row:
            if val != "X":
                winnerSum += int(val)

    return winnerSum * int(winningNum)

def playGameLast(numbers, boards):
    for i, n in enumerate(numbers):
        markNumbers(boards, n)

        winners = checkAllBoards(boards)

        if len(boards) == 1 and winners == [0]:
            return boards[0], int(n)

        boards = [b for i, b in enumerate(boards) if i not in winners]

if __name__ == "__main__":
    main()
