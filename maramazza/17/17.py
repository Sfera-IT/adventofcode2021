import time
from functools import reduce

def read_file():
    with open('17.txt') as f:
        lines = f.readlines()
    lines = [str(l.strip()) for l in lines][0].split()
    x_range = [int(i) for i in lines[2].split('=')[1].strip(",").split('..')]
    y_range = [int(i) for i in lines[3].split('=')[1].strip(",").split('..')]
    return x_range,y_range

def main():
    start = time.time()
    part1()
    middle = time.time()
    part2()
    end = time.time()
    print("Part 1 Time:  " + str(middle-start))
    print("Part 2 Time:  " + str(end-middle))
    print("Total Time:   " + str(end-start))
    
def is_on_target(x_range, y_range, coord):
    (x,y) = coord
    return x >= x_range[0] and x <= x_range[1] and y >= y_range[0] and y <= y_range[1]

def is_out_of_range(x_range, y_range, coord):
    (x,y) = coord
    return x > x_range[1] or y < y_range[0]
    
def run_step(velocity, coord, highestpoint):
    (x,y) = coord
    (vx, vy) = velocity
    
    coord = (x+vx, y+vy)
    
    if y+vy > highestpoint:
        highestpoint = y+vy
        
    if vx < 0:
        vx = vx + 1
    elif vx > 0: 
        vx = vx - 1
    velocity = (vx, vy-1)
    return (velocity, coord, highestpoint)
    
def part1(): 
    print("PART 1:")
    x_range = read_file()[0]
    y_range = read_file()[1]
    
    max_x = x_range[1]
    max_y = y_range[1]
    min_x = x_range[0]
    min_y = y_range[0]
    
    successful_velocities = []
    
    for x in range(0,max_x+1): #no point doing greater than max_x 
        for y in range(min_y,-min_y): #negative of the min is *likely* enough possible range
            startingvelocity = (x,y)
            velocity = (x,y)
            coord = (0,0)
            highestpoint = 0
            
            while True:
                (velocity, coord, highestpoint) = run_step(velocity, coord, highestpoint)
                if is_on_target(x_range, y_range, coord):
                    successful_velocities.append((startingvelocity, highestpoint))
                    break;
                elif is_out_of_range(x_range, y_range, coord): 
                    break;
                    
    max_highestpoint = successful_velocities[0][1]
    for i in range(len(successful_velocities)):
        (coord, highestpoint) = successful_velocities[i]
        if highestpoint > max_highestpoint:
            max_highestpoint = highestpoint
         
    result = max_highestpoint
    print("result: " + str(result))
    
def part2():
    print("PART 2:")
    x_range = read_file()[0]
    y_range = read_file()[1]
    
    max_x = x_range[1]
    max_y = y_range[1]
    min_x = x_range[0]
    min_y = y_range[0]
    
    successful_velocities = []
    
    for x in range(0,max_x+1): #no point doing greater than max_x 
        for y in range(min_y,-min_y): #negative of the min is *likely* enough possible range
            startingvelocity = (x,y)
            velocity = (x,y)
            coord = (0,0)
            highestpoint = 0
            
            while True:
                (velocity, coord, highestpoint) = run_step(velocity, coord, highestpoint)
                if is_on_target(x_range, y_range, coord):
                    successful_velocities.append((startingvelocity, highestpoint))
                    break;
                elif is_out_of_range(x_range, y_range, coord): 
                    break;
                    
    result = len(successful_velocities)
    print("result: " + str(result))
  
if __name__ == "__main__":
    main()