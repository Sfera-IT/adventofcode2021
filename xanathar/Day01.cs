using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;

namespace Day01 {
    public class Test1 : DayBase
    {
        public override void Run() {
            int count = 0;
            var data = File.ReadAllLines("data/day1.txt").Where(s => !string.IsNullOrEmpty(s)).Select(s => int.Parse(s)).ToArray();

            for (int i = 0; i < data.Length; i++)
                if (i != 0 && data[i] > data[i - 1]) count++;

            Console.WriteLine($"{count}");
        }
    }

    public class Test2 : DayBase
    {
        public override void Run() {
            int count = 0;
            var data = File.ReadAllLines("data/day1.txt").Where(s => !string.IsNullOrEmpty(s)).Select(s => int.Parse(s)).ToArray();

            for (int i = 0; i < data.Length; i++)
                if (i >= 3 && data[i] > data[i - 3]) count++;

            Console.WriteLine($"{count}");
        }
    }
}
