from os import path
from functools import reduce

def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day2.txt")
    with open(dataFile, "r") as f:
        data = f.readlines()

    # Your horizontal position and depth both start at 0.
    x = 0
    depth = 0
    while data:
      (dir, dist) = data.pop(0).split(" ")
      dist = int(dist)
      print(f"{dir} {dist}")
      if dir == "forward":
          x += dist
      elif dir in ["down", "up"]:
          depth += dist if dir == "down" else -dist

    print(f"Final position is x: {x} and depth: {depth}")
    print(f"Puzzle answer is: {abs(x) * abs(depth)}")

if __name__ == "__main__":
    main()