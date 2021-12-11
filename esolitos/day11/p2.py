from os import path
import sys

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
    # data = [[int(n) for n in list(x.strip())] for x in f.readlines()]
    m = [[{'c':int(n), 'f': False} for n in list(x.strip())] for x in f.readlines()]
  
  # rows = len(data)
  # cols = len(data[0])
  rows = len(m)
  cols = len(m[0])

  flash_count = 0
  for i in range(100):
    print(f"\nIteration {i+1}")
    for x in range(rows):
      for y in range(cols):
        # Reset flashed
        if m[x][y]['f']:
          m[x][y]['c'] = 0
          m[x][y]['f'] = False

        # Increase and reset
        m[x][y]['c'] += 1
    
    for x in range(rows):
      for y in range(cols):
        if m[x][y]['c'] > 9:
          flash_count += flash(m,x,y)

    # debug = [[m2['c'] if m2['c'] <= 9 else 0 for m2 in m1] for m1 in m]
    # print(debug)
    
    print(f"Flashed {flash_count} after iteration {i+1} ")

  print('Done.')


def flash(m,x,y):
  if m[x][y]['c'] <= 9 or m[x][y]['f']:
    return 0

  flashed = 1
  m[x][y]['f'] = True
  x1, y1 = (max(x-1, 0), max(y-1, 0))
  for xr in range(x1, min(x+2, len(m))):
    for yr in range(y1, min(y+2, len(m[x]))):
      m[xr][yr]['c'] += 1
      flashed += flash(m, xr, yr)
  
  return flashed


if __name__ == "__main__":
  main()