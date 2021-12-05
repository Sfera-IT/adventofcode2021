using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;
using System.Diagnostics;

namespace Day05 {

    public class Map
    {
        int[,] map;

        public Map(int w, int h)
        {
            map = new int[w, h];
        }

        public void FillRect(int x1, int y1, int x2, int y2)
        {
            if (x1 > x2)
            {
                int x = x1;
                x1 = x2;
                x2 = x;
            }

            if (y1 > y2)
            {
                int y = y1;
                y1 = y2;
                y2 = y;
            }

            for (int x = x1; x <= x2; x++)
            {
                for (int y = y1; y <= y2; y++)
                {
                    map[x, y] += 1;
                }
            }
        }

        public IEnumerable<int> Visit()
        {
            for (int x = 0; x < map.GetLength(0); x++)
            {
                for (int y = 0; y < map.GetLength(1); y++)
                {
                    yield return map[x, y];
                }
            }
        }

        public void Diagonal(int x1, int y1, int x2, int y2)
        {
            var dx = x2.CompareTo(x1);
            var dy = y2.CompareTo(y1);

            for(int x = x1, y = y1;
                (x != x2 + dx || dx == 0) && (y != y2 + dy || dy == 0);
                x += dx, y += dy)
            {
                map[x, y] += 1;
            }
        }
    }


    public class Test1 : DayBase
    {
        public override void Run()
        {
            Map m = new Map(1000, 1000);
            var lines = File.ReadAllLines("../data/day5.txt");

            foreach (var line in lines)
            {
                var l = line.Split(new char[] { ' ', ',', '-', '>' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => int.Parse(s)).ToArray();

                Debug.Assert(l.Length == 4);

                if (l[0] == l[2] || l[1] == l[3])
                    m.FillRect(l[0], l[1], l[2], l[3]);
            }

            Console.WriteLine("Count: {0}", m.Visit().Count(v => v >= 2));
        }
    }

    public class Test2 : DayBase
    {
        public override void Run()
        {
            Map m = new Map(1000, 1000);
            var lines = File.ReadAllLines("../data/day5.txt");

            foreach (var line in lines)
            {
                var l = line.Split(new char[] { ' ', ',', '-', '>' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => int.Parse(s)).ToArray();

                Debug.Assert(l.Length == 4);

                m.Diagonal(l[0], l[1], l[2], l[3]);
            }

            Console.WriteLine("Count: {0}", m.Visit().Count(v => v >= 2));
        }
    }
}
