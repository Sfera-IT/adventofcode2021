from os import path
import numpy as np
from scipy import stats
from bitstring import BitArray

# --- Day 4: Giant Squid ---
# 
# You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.
#
# Maybe it wants to play bingo?
#
# Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)
#
# The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:
#
# 7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
#
# 22 13 17 11  0
#  8  2 23  4 24
# 21  9 14 16  7
#  6 10  3 18  5
#  1 12 20 15 19
#
#  3 15  0  2 22
#  9 18 13 17  5
# 19  8  7 25 23
# 20 11 10 24  4
# 14 21 16 12  6
#
# 14 21 17 24  4
# 10 16 15  9 19
# 18  8 23 26 20
# 22 11 13  6  5
#  2  0 12  3  7
#
# After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows (shown here adjacent to each other to save space):
#
# 22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
#  8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
# 21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
#  6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
#  1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
#
# After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:
#
# 22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
#  8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
# 21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
#  6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
#  1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
#
# Finally, 24 is drawn:
#
# 22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
#  8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
# 21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
#  6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
#  1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
#
# At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).
#
# The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.
#
# To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?
#
def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day4.txt")
    # First line is the sequence of numbers to draw
    # Then we have a grid of boards separated by newlines
    with open(dataFile, "r") as f:
        numbers = f.readline().split(",")
        # Remove separator line
        f.readline()
        boards = f.readlines()
    
    boards = setup_boards(boards)

    winner = play_game(numbers, boards)
    print(f"Winner score: {winner}")
   

# Convert the boards into a 2D array of numbers
def setup_boards(boards_raw: list) -> list:
    boards = []
    new_board = []
    boardNum = 0
    for line in boards_raw:
        if line == "\n":
            boards.append(new_board)
            new_board = []
            continue

        new_board_line = {}
        for num in line.strip().split():
            new_board_line[num] = False
        new_board.append(new_board_line)

    return boards

def play_game(numbers: list, boards: list) -> int:
    # Play the game
    last_victorious_draw = None
    for num in numbers:
        print(f"\nDrawn:\t{num}")
        update_boards(num, boards)

        for winner in check_for_winner(boards):
            last_victorious_draw = int(num)
            boards.remove(winner)
    
    # Last winner
    return get_score(winner, last_victorious_draw)

def update_boards(num: int, boards: list):
    for board in boards:
        for row in board:
            if num in row.keys():
                row[num] = True

def check_for_winner(boards: list):
    for board in boards:
        if is_winner(board):
            print(f"Winner:\t{board}")
            yield board

    return None

def is_winner(board: list) -> bool:
    # Check for a row
    for row in board:
        if all(row.values()):
            return True
    # Check for a column
    for col in range(len(board[0])):
        if all([list(row.values())[col] for row in board]):
            return True

    return False

def get_score(board: list, last_drawn: int) -> int:
    score = 0
    for row in board:
        score += sum([int(x) for x in row.keys() if row[x] == False])

    return score * last_drawn

if __name__ == "__main__":
    main()