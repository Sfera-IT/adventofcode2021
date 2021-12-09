from os import path
import numpy as np
import sys

# --- Day 9: Smoke Basin ---
# 
# These caves seem to be lava tubes. Parts are even still volcanically active; small hydrothermal vents release smoke into the caves that slowly settles like rain.
# 
# If you can model how the smoke flows through the caves, you might be able to avoid it and be that much safer. The submarine generates a heightmap of the floor of the nearby caves for you (your puzzle input).
# 
# Smoke flows to the lowest point of the area it's in. For example, consider the following heightmap:
# 
# 2199943210
# 3987894921
# 9856789892
# 8767896789
# 9899965678
# 
# Each number corresponds to the height of a particular location, where 9 is the highest and 0 is the lowest a location can be.
# 
# Your first goal is to find the low points - the locations that are lower than any of its adjacent locations. Most locations have four adjacent locations (up, down, left, and right); locations on the edge or corner of the map have three or two adjacent locations, respectively. (Diagonal locations do not count as adjacent.)
# 
# In the above example, there are four low points, all highlighted: two are in the first row (a 1 and a 0), one is in the third row (a 5), and one is in the bottom row (also a 5). All other locations on the heightmap have some lower adjacent location, and so are not low points.
# 
# The risk level of a low point is 1 plus its height. In the above example, the risk levels of the low points are 2, 1, 6, and 6. The sum of the risk levels of all low points in the heightmap is therefore 15.
# 
# Find all of the low points on your heightmap. What is the sum of the risk levels of all low points on your heightmap?
# 
#   --- Part Two ---
# 
# Next, you need to find the largest basins so you know what areas are most important to avoid.
# 
# A basin is all locations that eventually flow downward to a single low point. Therefore, every low point has a basin, although some basins are very small. Locations of height 9 do not count as being in any basin, and all other locations will always be part of exactly one basin.
# 
# The size of a basin is the number of locations within the basin, including the low point. The example above has four basins.
# 
# The top-left basin, size 3:
# 
# 2199943210
# 3987894921
# 9856789892
# 8767896789
# 9899965678
# 
# The top-right basin, size 9:
# 
# 2199943210
# 3987894921
# 9856789892
# 8767896789
# 9899965678
# 
# The middle basin, size 14:
# 
# 2199943210
# 3987894921
# 9856789892
# 8767896789
# 9899965678
# 
# The bottom-right basin, size 9:
# 
# 2199943210
# 39878949z1
# 9856789892
# 8767896789
# 9899965678
# 
# Find the three largest basins and multiply their sizes together. In the above example, this is 9 * 14 * 9 = 1134.
# 
# What do you get if you multiply together the sizes of the three largest basins?
# 
def main():
  fname = path.basename(path.dirname(__file__))
  # fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  with open(dataFile, "r") as f:
    data = [[int(y) for y in list(x.strip())] for x in f.readlines()]
  
  matrix = np.matrix(data)
  nines = np.count_nonzero(matrix == 9)

  if "--show" in sys.argv:
    import matplotlib.pyplot as plt
    plt.matshow(matrix)
    plt.colorbar()
    plt.show()  

  max_x = matrix.shape[0]
  max_y = matrix.shape[1]
  minimums = []
  for x in range(max_x):      
    for y in range(max_y):
      num = matrix[x,y]
      if (x > 0 and matrix[x-1,y] <= num):
        continue
      if (x < max_x-1 and matrix[x+1,y] <= num):
        continue
      if (y > 0 and matrix[x,y-1] <= num):
        continue
      if (y < max_y-1 and matrix[x,y+1] <= num):
        continue

      minimums.append((x,y))
  
  basins = []
  for x, y in minimums:
    basins.append(walk_basin(matrix, x, y))
  
  basins.sort(reverse=True)
  print(f"Sound {nines} 9s and {sum(basins)} basins.\nNines + Basins (should be 10k): {sum(basins)+nines}")

  tot = basins[0] * basins[1] * basins[2]
  print(f"Tot: {tot}")
  

def walk_basin(m, x, y):
  size = 1
  m[x,y] = 9

  # X Axiz
  if x > 0 and m[x-1,y] != 9:
    size += walk_basin(m, x-1, y)
  if x < (m.shape[0]-1) and m[x+1,y] != 9:
    size += walk_basin(m, x+1, y)

  # Y Axiz
  if y > 0 and m[x,y-1] != 9:
    size += walk_basin(m, x, y-1)
  if y < (m.shape[1]-1) and m[x,y+1] != 9:
    size += walk_basin(m, x, y+1)

  return size


if __name__ == "__main__":
  main()