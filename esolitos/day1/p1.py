from os import path
from functools import reduce

def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day1.txt")
    with open(dataFile, "r") as f:
        data = f.readlines()

    data = [int(x) for x in data]

    # Counts the occurrenced when each number is larger than the previous one
    count = 0
    for k,v in enumerate(data):
      count += 1 if v > data[k-1] else 0        

if __name__ == "__main__":
    main()