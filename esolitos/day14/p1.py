from os import path
import numpy as np
import sys
import re
import collections

# --- Day 14: Extended Polymerization ---
def main():
  fname = path.basename(path.dirname(__file__))
  fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  # fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  with open(dataFile, "r") as f:
    data = f.readlines()
    polymer = data[0].strip()
    pairs = [tuple(x.strip().split(' -> ')) for x in data[2:]]
  
  # print(f"Step 0:  {polymer}")
  for i in range(10):
    polymer = process_step(polymer, pairs)
    # print(f"Step {i+1}:  {polymer}")
    # print(f"Step {i+1}")

  c = collections.Counter(polymer).most_common()
  most = c[0][1]
  least = c[-1][1]

  print(f"Result: {most} - {least} = {most - least}")


def process_step(polymer: str, pairs: list) -> str:
  replacements = []
  for match,inject in pairs:
    for m in re.finditer(f'(?={match})', polymer):
      replacements.append((m.start(), inject))

  replacements.sort(key=lambda x : x[0])

  offset = 0
  for start,l in replacements:
    split = (start + offset) + 1
    polymer = f"{polymer[0:split]}{l}{polymer[split:]}"
    offset += 1

  return polymer



if __name__ == '__main__':
  main()