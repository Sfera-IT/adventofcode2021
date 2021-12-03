from os import path
from functools import reduce

def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day2.txt")
    with open(dataFile, "r") as f:
        data = f.readlines()

    # Your horizontal position and depth both start at 0.
    distance = 0
    depth = 0
    aim = 0

    while data:
      (dir, dist) = data.pop(0).split(" ")
      dist = int(dist)
      
      # forward X does two things:
      # It increases your horizontal position by X units.
      # It increases your depth by your aim multiplied by X.
      if dir == "forward":
          distance += dist
          depth += (dist * aim)
      # down X increases your aim by X units.
      # up X decreases your aim by X units.
      elif dir in ["down", "up"]:
          aim += dist if dir == "down" else -dist

    print(f"Final position is x: {distance} and depth: {depth}")
    print(f"Puzzle answer is: {distance * depth}")

if __name__ == "__main__":
    main()