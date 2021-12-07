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
    # depths = np.array(data)
    # mode = stats.mode(depths)
    # mean = np.mean(depths)
    # median1 = stats.median_absolute_deviation(depths)
    # median2 = stats.median_abs_deviation(depths)
    # multimode = s.multimode(data)

    # if "--show" in sys.argv:    
    #   import matplotlib.pyplot as plt
    #   plt.hist(depths, bins=np.arange(depths.min(), depths.max()+1))
    #   plt.show()


    fuel_consumption = {}
    for meeting_point in unique_depths:
      fuel = 0
      for x in data:
        fuel += sum(range(abs(x - meeting_point)+1))

      fuel_consumption[meeting_point] = fuel

    min_fuel = min(fuel_consumption.values())
    print(f"Min: {min_fuel}")

    if "--show" in sys.argv:    
      import matplotlib.pyplot as plt
      plt.bar(range(len(fuel_consumption)), list(fuel_consumption.values()), align='center')
      plt.xticks(range(len(fuel_consumption)), list(fuel_consumption.keys()))
      plt.show()


if __name__ == "__main__":
  main()