using System.Diagnostics;

namespace Day15;

public class Element
{
    public Element(int height)
    {
        Height = height;
        CurrentCost = Int32.MaxValue;
    }

    public int Height { get; set; }

    public int CurrentCost { get; set; }
}

public static class Program
{
    private static Element[,] board = new Element[0, 0];
    private static int sizeX;
    private static int sizeY;
    private static void Main()
    {
        var lines = File.ReadAllLines("input15.txt");
        const int repeatNumber = 5;

        // Step 1 is to parse the input
        var lineLength = lines[0].Length;
        var numLines = lines.Length;
        sizeX = lineLength * repeatNumber;
        sizeY = numLines * repeatNumber;
        board = new Element[sizeX, sizeY];

        for (int j = 0; j < sizeY; j++)
        {
            for (int i = 0; i < sizeX; i++)
            {
                var baseValue = (lines[j % numLines][i % lineLength] - 48) + (j / numLines) + (i / lineLength);
                board[i, j] = new Element(baseValue > 9 ? baseValue - 9 : baseValue);
            }
        }

        // cycle more than one time to warm the execution and have better measurement
        for (int k = 0; k < 20; k++)
        {
            for (int j = 0; j < sizeY; j++)
            {
                for (int i = 0; i < sizeX; i++)
                {
                    board[i, j].CurrentCost = int.MaxValue;
                }
            }

            var sw = Stopwatch.StartNew();
            Dijkstra();
            Console.WriteLine("Current cost {0} found in {1} ms", board[sizeX - 1, sizeY - 1].CurrentCost, sw.ElapsedMilliseconds);
        }
        Console.ReadKey();
    }

    private static void Dijkstra()
    {
        // it is of uttermost importance that you use a PriorityQueue so you do not
        // pay the price of popping the next element.
        var set = new PriorityQueue<(int x, int y, int currentCost), int>();
        set.Enqueue((0, 0, 0), 0);
        while (set.Count > 0)
        {
            // next node is the one with smaller cost in the list.
            var (x, y, cost) = set.Dequeue();

            var element = board[x, y];

            // if this cost is not less than the currentcost of the node, we have a better
            // path found for that node, no need to proceed.
            if (cost >= element.CurrentCost)
            {
                continue;
            }

            // update the cost and check for termination
            element.CurrentCost = cost;
            if (x == sizeX - 1 && y == sizeY - 1)
            {
                // the Dijkstra algorithm assure that this is the shortest path, because
                // we always popped the element with shortest path to check
                break;
            }

            // try visiting all other nodes.
            Visit(x + 1, y, cost);
            Visit(x, y + 1, cost);
            Visit(x - 1, y, cost);
            Visit(x, y - 1, cost);
        }

        void Visit(int x, int y, int currentCost)
        {
            // check if the coordinates are outside the map
            if (x >= 0 && y >= 0 && x < sizeX && y < sizeY)
            {
                // even if coordinated are inside the map, we add potential node
                // only if there is an advantage.
                var element = board[x, y];
                var newCost = element.Height + currentCost;
                if (newCost < element.CurrentCost)
                {
                    set.Enqueue((x, y, newCost), newCost);
                }
            }
        }
    }
}