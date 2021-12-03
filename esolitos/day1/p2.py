from os import path
from functools import reduce

def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day1.txt")
    with open(dataFile, "r") as f:
        data = f.readlines()

    data = [int(x) for x in data]

    # Counts "the number of times the sum of measurements in this sliding window increas"
    count = 0
    for k,v in enumerate(data):
        # Sliding window of size 3
        a2c = sum(data[k:k+3])
        b2d = sum(data[k+1:k+4])

        count += 1 if b2d > a2c else 0

    print(count)

if __name__ == "__main__":
    main()