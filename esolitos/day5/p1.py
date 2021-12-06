from os import path
import numpy as np
from scipy import stats
from bitstring import BitArray

# --- Day 5: Hydrothermal Venture ---
# 
# You come across a field of hydrothermal vents on the ocean floor! These vents constantly produce large, opaque clouds, so it would be best to avoid them if possible.
# 
# They tend to form in lines; the submarine helpfully produces a list of nearby lines of vents (your puzzle input) for you to review. For example:
# 
# 0,9 -> 5,9
# 8,0 -> 0,8
# 9,4 -> 3,4
# 2,2 -> 2,1
# 7,0 -> 7,4
# 6,4 -> 2,0
# 0,9 -> 2,9
# 3,4 -> 1,4
# 0,0 -> 8,8
# 5,5 -> 8,2
# 
# Each line of vents is given as a line segment in the format x1,y1 -> x2,y2 where x1,y1 are the coordinates of one end the line segment and x2,y2 are the coordinates of the other end. These line segments include the points at both ends. In other words:
# 
#     An entry like 1,1 -> 1,3 covers points 1,1, 1,2, and 1,3.
#     An entry like 9,7 -> 7,7 covers points 9,7, 8,7, and 7,7.
# 
# For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.
# 
# So, the horizontal and vertical lines from the above list would produce the following diagram:
# 
# .......1..
# ..1....1..
# ..1....1..
# .......1..
# .112111211
# ..........
# ..........
# ..........
# ..........
# 222111....
# 
# In this diagram, the top left corner is 0,0 and the bottom right corner is 9,9. Each position is shown as the number of lines which cover that point or . if no line covers that point. The top-left pair of 1s, for example, comes from 2,2 -> 2,1; the very bottom row is formed by the overlapping lines 0,9 -> 5,9 and 0,9 -> 2,9.
# 
# To avoid the most dangerous areas, you need to determine the number of points where at least two lines overlap. In the above example, this is anywhere in the diagram with a 2 or larger - a total of 5 points.
# 
# Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
#
def main():
    dataFile = path.join(path.dirname(__file__), "../_data/day5.txt")
    with open(dataFile, "r") as f:
        data = f.readlines()

    #    
    # data = [x.strip(" -> ") for x in data]
    # data = [x.strip().split(" -> ") for x in data]
    matrix = setup_matrix()

    # Split each line in two points (tuple, csv) separated by a " -> "
    data = [x.strip().split(" -> ") for x in data]
    data = [(x[0].split(","), x[1].split(",")) for x in data]
    
    data = clenup_valid_vectors(data)

    matrix = update_matrix_with_vectors(matrix, data)

    tot = matrix[matrix > 1].shape[0]
    print("Total: {}".format(tot))

def setup_matrix():
    """
    Setup the matrix
    """
    matrix = np.zeros((1000, 1000), dtype=int)
    return matrix

def clenup_valid_vectors(data):
    """
    Only keep "vertical" and "horizontal" vectors

    A vertical vector is a line where x1 = x2, and a horizontal vector is a line where y1 = y2
    """
    valid_vectors = []
    for vector in data:
        # Compare the x and y values of the two points
        if vector[0][0] == vector[1][0] or vector[0][1] == vector[1][1]:
            valid_vectors.append(vector)

    return valid_vectors

def update_matrix_with_vectors(matrix, vectors):
    """
    Update the matrix with the given vectors
    """
    for vector in vectors:
        # Get the x and y values of the two points
        x1, y1 = [int(x) for x in vector[0]]
        x2, y2 = [int(x) for x in vector[1]]

        if x1 == x2:
            # Vertical vector
            line = [min(y1, y2), max(y1, y2)+1]
            matrix[x1, line[0]:line[1]] += 1
        elif y1 == y2:
            # Horizontal vector
            line = [min(x1, x2), max(x1, x2)+1]
            matrix[line[0]:line[1], y1] += 1

    return matrix
if __name__ == "__main__":
    main()