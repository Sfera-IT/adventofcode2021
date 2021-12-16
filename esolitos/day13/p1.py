from os import path
import sys

# --- Day 13: Transparent Origami ---
def main():
  fname = path.basename(path.dirname(__file__))
  fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  # fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  data = []
  instr = []
  with open(dataFile, "r") as f:
    raw = [x.strip() for x in f.readlines()]
    for x in raw:
      if len(x) <= 0 or x[0] == 'f':
        break
      data.append([int(x) for x in x.split(',')])
      # data.append(x)

    for x in raw:
      if len(x.strip()) > 0 and x[0] == 'f':
        instr.append(tuple(x.strip()[11:].split('=')))

  matrix = {}
  for y,x in data:
    if x not in matrix.keys():
      matrix[x] = {}   
    matrix[x][y] = 1
  
  for dir,fold in instr:
    fold = int(fold)
    # printitout(matrix)

    # We assume that we're always folding in half.
    # Thus the full size is 2 x $fold + 1
    size = (fold*2) + 1
    if dir == 'x':
      fold_horiz(matrix, fold, size)
    if dir == 'y':
      fold_vert(matrix, fold, size)
    
    sum = count_items(matrix)
    print(f'Step: {sum}')
  
  
  printitout(matrix)
  print(f'Done: {sum}')

def fold_horiz(matrix: dict, fold: int, width: int) -> dict:
  for n in range(fold, width):
    n1 = fold_x(n, width)
    # Nothing to do when folded index = non-folded index
    if n == n1:
      continue
    for i in matrix:
      val = matrix[i].pop(n, None)
      # Keep on going if either:
      # a) n1 is None => It is the folding line
      # b) val is None => Point did not exist
      if n1 is None or val is None:
        continue
      # Else add the point to the new position
      matrix[i][n1] = 1

  return matrix


def fold_vert(matrix: dict, fold: int, height: int) -> dict:
  for n in range(fold, height):
    n1 = fold_x(n, height)
    # Unchanged value when folded
    if n == n1:
      continue

    row = matrix.pop(n, None)
    # Row does not exist
    if not row:
      continue
    # Folding line, remove and proceed.
    if n1 is None:
      continue

    # Copy over the values on the new row
    if n1 not in matrix:
      matrix[n1] = {}

    matrix[n1].update(row)

    # for x in row:
    #   matrix[n1][x] = 1

  return matrix


def count_items(m: dict) -> int:
  c = 0
  for r in m:
    c += len(m[r])

  return c

def fold_x(x:int, w:int) -> int or None:
  half_real = int((w-1)/2)
  if x < half_real:
    return x
  if x == half_real:
    return None
  
  return int(abs(x - (w - 1)) % half_real)

def printitout(m):
  print('\n---------------------------\n')
  width = 0
  for y in range(max(m.keys())):
    if y in m:
      width = max(width, max(m[y].keys()))

  for y in range(max(m.keys())+1):
    for x in range(width+1):
      c = '#' if (y in m and x in m[y]) else '.'
      print(c, end='')
    print()


if __name__ == "__main__":
  main()