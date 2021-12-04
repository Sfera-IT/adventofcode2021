using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;

namespace Day04 {

    class BingoBoard
    {
        public int[,] Numbers;
        public bool[,] Marked;

        public void Mark(int num)
        {
            for(int x = 0; x < 5; x++)
                for(int y = 0; y < 5; y++)
                    if (Numbers[x, y] == num)
                        Marked[x, y] = true;
        }

        public bool IsWon()
        {
            for(int x = 0; x < 5; x++)
            {
                if (Marked[x, 0] && Marked[x, 1] && Marked[x, 2] && Marked[x, 3] && Marked[x, 4])
                    return true;
                if (Marked[0, x] && Marked[1, x] && Marked[2, x] && Marked[3, x] && Marked[4, x])
                    return true;
            }
            return false;
        }

        public int UnmarkedSum()
        {
            int sum = 0;

            for(int x = 0; x < 5; x++)
                for(int y = 0; y < 5; y++)
                    if (!Marked[x, y])
                        sum += Numbers[x, y];

            return sum;
        }
    }

    class BingoGame
    {
        public Queue<int> Numbers;
        public List<BingoBoard> Boards;

        public BingoGame(string[] lines)
        {
            Numbers = new Queue<int>(lines[0].Split(',').Select(s => int.Parse(s)));
            Boards = new List<BingoBoard>();

            for(int i = 2; i < lines.Length; i+=6)
            {
                BingoBoard b = new BingoBoard();
                b.Numbers = new int[5, 5];
                b.Marked = new bool[5, 5];
                for(int j = 0; j < 5; j++)
                {
                    int[] nums = lines[i+j].Split(' ', StringSplitOptions.RemoveEmptyEntries).Select(s => int.Parse(s)).ToArray();
                    b.Numbers[j, 0] = nums[0];
                    b.Numbers[j, 1] = nums[1];
                    b.Numbers[j, 2] = nums[2];
                    b.Numbers[j, 3] = nums[3];
                    b.Numbers[j, 4] = nums[4];
                }
                Boards.Add(b);
            }
        }

        public BingoBoard Winner()
        {
            return Boards.FirstOrDefault(b => b.IsWon());
        }

        public int? ExtractNumber()
        {
            if (Numbers.Count == 0)
                return null;

            int num = Numbers.Dequeue();

            foreach (var b in Boards)
            {
                b.Mark(num);
            }
            return num;
        }

        public void RemoveWinners()
        {
            Boards.RemoveAll(b => b.IsWon());
        }
    }


    public class Test1 : DayBase
    {
        public override void Run()
        {
            BingoGame g = new BingoGame(File.ReadAllLines("../data/day4.txt"));

            while(true)
            {
                int num = g.ExtractNumber().Value;
                BingoBoard w = g.Winner();

                if (w != null)
                {
                    Console.WriteLine($"n:{num} s:{w.UnmarkedSum()} *:{num*w.UnmarkedSum()}");
                    break;
                }
            }
        }
    }

    public class Test2 : DayBase
    {
        public override void Run()
        {
            BingoGame g = new BingoGame(File.ReadAllLines("../data/day4.txt"));
            BingoBoard winner = null;
            int wnum = 0;

            while(true)
            {
                int? num = g.ExtractNumber();

                if (num == null)
                    break;

                BingoBoard w = g.Winner();

                if (w != null)
                {
                    winner = w;
                    wnum = num.Value;
                    g.RemoveWinners();
                }
            }

            Console.WriteLine($"n:{wnum} s:{winner.UnmarkedSum()} *:{wnum*winner.UnmarkedSum()}");
        }
    }
}
