from os import path
import numpy as np
import sys
from enum import Enum

# --- Day 11: Dumbo Octopus ---
# 
# You enter a large cavern full of rare bioluminescent dumbo octopuses! They seem to not like the Christmas lights on your submarine, so you turn them off for now.
# 
# There are 100 octopuses arranged neatly in a 10 by 10 grid. Each octopus slowly gains energy over time and flashes brightly for a moment when its energy is full. Although your lights are off, maybe you could navigate through the cave without disturbing the octopuses if you could predict when the flashes of light will happen.
# 
# Each octopus has an energy level - your submarine can remotely measure the energy level of each octopus (your puzzle input). For example:
# 
# 5483143223
# 2745854711
# 5264556173
# 6141336146
# 6357385478
# 4167524645
# 2176841721
# 6882881134
# 4846848554
# 5283751526
# 
# The energy level of each octopus is a value between 0 and 9. Here, the top-left octopus has an energy level of 5, the bottom-right one has an energy level of 6, and so on.
# 
# You can model the energy levels and flashes of light in steps. During a single step, the following occurs:
# 
#     First, the energy level of each octopus increases by 1.
#     Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level increased beyond 9. (An octopus can only flash at most once per step.)
#     Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
# 
# Adjacent flashes can cause an octopus to flash on a step even if it begins that step with very little energy. 
# 
def main():
  fname = path.basename(path.dirname(__file__))
  fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  # fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  with open(dataFile, "r") as f:
    data = [[int(n) for n in list(x.strip())] for x in f.readlines()]
  
  rows = len(data)
  cols = len(data[0])

  # data_type = {'names':('pow', 'flash'),'formats':('i', '?')}
  # m = np.zeros(rows*cols, dtype=data_type).reshape(rows,cols)
  # m['pow'] = data
  m = np.matrix(data)

  flash_count = 0
  for i in range(100):
    print(f"\nIteration {i+1}")
    # Increase all by 1
    # m['pow'] += 1
    m += 1

    # Get all flashed items
    # flashed = np.argwhere(m['flash']==True)
    # flashed = np.argwhere(m > 9)
    while True:
      flashed = np.argwhere(m == 10)
      if not flashed.size:
        break
      for x,y in flashed:
        inc_neigbors(m,x,y)

    # m['flash'] = m['pow'] > 9
    # flash_count += m[m['pow'] > 9]['pow'].size
    flash_count += m[m > 9].size

    # m[m['pow'] > 9]['pow'] = 0
    m[m > 9] = 0

    # flashed = np.argwhere(m['pow'] > 9)
    # flash_count += flashed.size
    # for x,y in flashed:
    #   m[x,y]['pow'] = 0
    
    # m['flash'] = False
    print(f"Flashed {flash_count} after iteration {i+1} ")

  print('Done.')


def inc_neigbors(m,x,y):
  x1, y1 = (max(x-1, 0), max(y-1, 0))
  x2 = min(x+2, m.shape[0]) if x > 0 else 2
  y2 = min(y+2, m.shape[1]) if y > 0 else 2
  # m[x1:x2, y1:y2]['pow'] += 1

  # print(f"Item {x}:{y}: {m[x,y]}")
  # print(m[x1:x2, y1:y2])
  m[x1:x2, y1:y2] += 1
  # m[x1:x1+3, y1:y1+3] += 1
  # print(m[x1:x2, y1:y2])

  pass
  


if __name__ == "__main__":
  main()