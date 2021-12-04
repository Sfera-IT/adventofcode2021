from board import Board

def main():
    """
    Simply execute advent of code 2021 number 04
    """
    with open("input.txt") as file:
        lines = file.readlines()
        lines = [line.rstrip() for line in lines]

    # First line contains extractions
    extractions = [int (s) for s in lines[0].split(",")]
    boards = []

    # we can iterate, whenever we found an empty line, it is 
    # marker for a new board.
    for line in lines[1:]:
        if line == "":
            # new board is starting
            current_board = Board()
            boards.append(current_board)
        else:
            # it is a standard line of a board.
            current_board.load_line(line)

    # perform the extractions on each board and verify
    # if the board is completed.    
    for num in extractions:
        for board in boards:
            board.check_number(num)
            if board.completed:
                print(num * board.score())
                return

if __name__ == "__main__":
    main()
