class Board:

    def __init__(self):
        self.rows = []
        self.completed = False

    def load_line(self, line):
        splitted = line.split(' ')
        self.rows.append([int (s) for s in filter(None, splitted)])

    def check_number(self, number):
        for row in self.rows:
            for i in range(0, 5):
                if row[i] == number:
                    row[i] = 0
                    self.completed = self.__check_completed()
    
    def score(self) -> int:
        score = 0
        for row in self.rows:
            for num in row:
                score += num
        return score
        
    def __check_completed(self):
        for row in self.rows:
            if (all(num == 0 for num in row)):
                return True
        # now check columns
        for i in range(0, 5):
            column = [row[i] for row in self.rows]
            if (all(num == 0 for num in column)):
                return True
        return False
