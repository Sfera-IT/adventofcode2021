from os import path
import numpy as np
import sys
from enum import Enum


def main():
  fname = path.basename(path.dirname(__file__))
  fname = f"{fname}.txt" if '--real' in sys.argv else f"{fname}-test.txt"
  # fname = f"{fname}.txt"
  dataFile = path.join(path.dirname(__file__), "../_data/", fname)
  with open(dataFile, "r") as f:
    data = [x.strip() for x in f.readlines()]
  

if __name__ == "__main__":
  main()