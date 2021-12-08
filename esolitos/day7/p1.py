from os import path
import numpy as np
from scipy import stats
import statistics as s
import sys

def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day7.txt")
    with open(dataFile, "r") as f:
        data = [int(x) for x in f.readline().split(',')]

    unique_depths = set(data)
    print(s.multimode(data))
    print(s.mean(data))
    print(s.median(data))
    print(s.harmonic_mean(data))

    # if "--show" in sys.argv:    
    #   import matplotlib.pyplot as plt
    #   plt.hist(depths, bins=np.arange(depths.min(), depths.max()+1))
    #   plt.show()


    fuel_consumption = {}
    for meeting_point in unique_depths:
      fuel = 0
      for x in data:
        fuel += abs(x - meeting_point)

      fuel_consumption[meeting_point] = fuel
      # print(f"Meet: {meeting_point}\nFuel:\t{fuel}")

    key_list = list(fuel_consumption.keys())
    val_list = list(fuel_consumption.values())
    min_fuel = min(val_list)
    print(f"Min: {min_fuel} at position {key_list[val_list.index(min_fuel)]}")

    if "--show" in sys.argv:    
      import matplotlib.pyplot as plt
      plt.bar(range(len(fuel_consumption)), list(fuel_consumption.values()), align='center')
      plt.xticks(range(len(fuel_consumption)), list(fuel_consumption.keys()))
      plt.show()


if __name__ == "__main__":
  main()