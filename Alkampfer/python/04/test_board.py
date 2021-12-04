from board import Board

def test_load_line():
    """
    Verify ability to parse a single line of input
    """
    sut = Board()
    sut.load_line("12 13  3 14  6")
    assert len(sut.rows) == 1
    assert sut.rows[0] == [12, 13, 3, 14, 6]

def test_load_two_lines():
    """
    Verify ability to parse multiple lines of input
    """
    sut = Board()
    sut.load_line("12 13  3 14  6")
    sut.load_line("22 23 24 25 26")
    assert len(sut.rows) == 2
    assert sut.rows[0] == [12, 13, 3, 14, 6]
    assert sut.rows[1] == [22, 23, 24, 25, 26]

def test_check_number():
    """
    Verify checking number zeroed that number
    """
    sut = generate_a_board()
    sut.check_number(23)
    assert sut.rows[1] == [22, 0, 24, 25, 26]

def test_check_number_trigger_completed_for_row():
    """
    Verify board is done if a row is zeroed
    """
    sut = generate_a_board()
    for i in range(22, 27):
        sut.check_number(i)
    assert sut.completed

def test_check_number_trigger_completed_for_column():
    """
    Verify board is done if a column is zeroed
    """
    sut = generate_a_board()
    for i in (12, 22, 32, 42, 52):
        sut.check_number(i)
    assert sut.completed


def generate_a_board() -> Board:
    """
    Generate a board with a known state
    """
    board = Board()
    board.load_line("12 13 14 15 16")
    board.load_line("22 23 24 25 26")
    board.load_line("32 33 34 35 36")
    board.load_line("42 43 44 45 46")
    board.load_line("52 53 54 55 56")
    return board
