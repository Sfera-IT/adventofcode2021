def read_points_grid(input):
    g = []
    for line in input:
        g.append([int(p) for p in line])
    return g

def adjacent_values(grid, r, c):
    adj = []
    # up
    if r >= 1:
        adj.append(grid[r-1][c])
    # down
    if r < len(grid) - 1:
        adj.append(grid[r+1][c])
    # left
    if c >= 1:
        adj.append(grid[r][c-1])
    # right
    if c < len(grid[0]) - 1:
        adj.append(grid[r][c+1])
    return adj

def adjacent_points_threshold(grid, r, c, t):
    # given starting point (r,c) in grid
    # return points adjacent to it which have values less than
    # threshold value t
    adj_points = []
    # up
    if r >= 1 and grid[r-1][c] < t:
        adj_points.append((r-1,c))
    # down
    if r < len(grid) - 1 and grid[r+1][c] < t:
        adj_points.append((r+1,c))
    # left
    if c >= 1 and grid[r][c-1] < t:
        adj_points.append((r,c-1))
    # right
    if c < len(grid[0]) - 1 and grid[r][c+1] < t:
        adj_points.append((r,c+1))
    return adj_points

def part1(input):
    low_points = []
    risk = 0
    g = read_points_grid(input)
    for r in range(len(g)):
        for c in range(len(g[0])):
            if g[r][c] < min(adjacent_values(g, r, c)):
                risk += g[r][c] + 1
    return risk


def basin(g, r, c, basin_pts=set()):
    adjacent = set(adjacent_points_threshold(g, r, c, 9))
    additional = adjacent - basin_pts
    #print(f"r: {r}, {c}, adjacent: {adjacent}, additional: {additional}, basin_pts: {basin_pts}")
    if len(additional) == 0:
        return basin_pts
    else:
        basin_pts |= additional
        for (rp, cp) in additional:
            basin_pts |= basin(g, rp, cp, basin_pts)
        return basin_pts

def part2(input):
    low_points = []
    g = read_points_grid(input)

    for r in range(len(g)):
        for c in range(len(g[0])):
            if g[r][c] < min(adjacent_values(g, r, c)):
                low_points.append((r,c))

    basin_sizes = []
    for (r,c) in low_points:
        b = basin(g,r,c,set())
        basin_sizes.append(len(b))
    basin_sizes = sorted(basin_sizes, reverse=True)
    top3 = [d for d in basin_sizes[:3]]
    return top3[0] * top3[1] * top3[2]


import os.path
day = os.path.basename(__file__).split('.')[0][-2:]
input = list((l.strip() for l in open(f"./{day}.txt").readlines()))
print(f"Day {day}")
print("part 1:", part1(input))
print("part 2:", part2(input))