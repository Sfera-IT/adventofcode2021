using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;

namespace Day03 {
    public class Common
    {
        public static long BinaryToLong<T>(T[] bin, Func<T, int> preprocess)
        {
            long result = 0;

            for(int i = 0; i < bin.Length; i++)
            {
                result <<= 1;
                result |= (uint)preprocess(bin[i]);
            }

            return result;
        }

        public static int? FindCommon(IEnumerable<string> data, int column)
        {
            int count1 = 0;
            int count0 = 0;

            foreach (string s in data)
            {
                if (s[column] == '1')
                    count1++;
                else
                    count0++;
            }

            if (count1 > count0)
                return 1;
            else if (count0 > count1)
                return 0;
            else
                return null;
        }
    }


    public class Test1 : DayBase
    {
        public override void Run() {
            var data = File.ReadAllLines("../data/day3.txt").Where(s => !string.IsNullOrEmpty(s)).ToArray();

            var common = new int[data[0].Length];

            for(int col = 0; col < data[0].Length; col++)
            {
                common[col] = Common.FindCommon(data, col) ?? 0;
            }

            long gamma = Common.BinaryToLong<int>(common, v => v);
            long epsil = Common.BinaryToLong<int>(common, v => 1 - v);

            Console.WriteLine($"g={gamma}, e={epsil}, g*e={gamma*epsil}");
        }
    }

    public class Test2 : DayBase
    {
        public override void Run()
        {
            var o2data = File.ReadAllLines("../data/day3.txt").Where(s => !string.IsNullOrEmpty(s)).ToList();
            var co2data = o2data.ToList();

            for(int col = 0; col < o2data[0].Length && o2data.Count > 1; col++)
            {
                int v = Common.FindCommon(o2data, col) ?? 1;
                char cv = v == 1 ? '1' : '0';
                o2data.RemoveAll(v => v[col] != cv);
            }

            for(int col = 0; col < co2data[0].Length && co2data.Count > 1; col++)
            {
                int v = Common.FindCommon(co2data, col) ?? 1;
                char cv = v == 1 ? '0' : '1';
                co2data.RemoveAll(v => v[col] != cv);
            }

            long o2 = Common.BinaryToLong<char>(o2data[0].ToArray(), v => v - '0');
            long co2 = Common.BinaryToLong<char>(co2data[0].ToArray(), v => v - '0');

            Console.WriteLine($"o2={o2}, co2={co2}, *={co2*o2}");
        }
    }
}
