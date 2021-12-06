using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;

namespace Day06 {
    public class Test1 : DayBase
    {
        List<int> fishes = new List<int>() {
            1,3,4,1,1,1,1,1,1,1,1,2,2,1,4,2,4,1,1,1,1,1,5,4,1,1,2,1,1,1,1,4,1,1,1,4,4,1,1,1,1,1,1,1,2,4,1,
            3,1,1,2,1,2,1,1,4,1,1,1,4,3,1,3,1,5,1,1,3,4,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,5,2,5,5,3,2,1,5,
            1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,5,1,1,1,1,5,1,1,1,1,1,4,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,3,
            1,2,4,1,5,5,1,1,5,3,4,4,4,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,5,3,1,4,1,1,2,2,1,2,2,5,1,1,1,2,1,
            1,1,1,3,4,5,1,2,1,1,1,1,1,5,2,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,4,1,5,1,1,1,1,1,1,1,1,1,1,1,1,1,
            2,1,1,1,1,5,4,5,1,1,1,1,1,1,1,5,1,1,3,1,1,1,3,1,4,2,1,5,1,3,5,5,2,1,3,1,1,1,1,1,3,1,3,1,1,2,4,
            3,1,4,2,2,1,1,1,1,1,1,1,5,2,1,1,1,2
        };

        void Evolve()
        {
            List<int> new_fishes = new List<int>();

            foreach(int f in fishes)
            {
                int nf = f - 1;
                if (nf < 0)
                {
                    new_fishes.Add(6);
                    new_fishes.Add(8);
                }
                else
                {
                    new_fishes.Add(nf);
                }
                fishes = new_fishes;
            }
        }

        public override void Run() {
            for(int day = 0; day < 80; day++)
            {
                Evolve();
            }

            Console.WriteLine($"{fishes.Count}");
        }
    }

    public class Test2 : DayBase
    {
        long[] fishes = new long[9];

        void Init(params int[] args)
        {
            foreach(int v in args)
            {
                fishes[v]++;
            }
        }

        void Evolve()
        {
            long[] new_fishes = new long[9];

            for(int i = 1; i <= 8; i++)
                new_fishes[i - 1] = fishes[i];

            new_fishes[6] += fishes[0];
            new_fishes[8] += fishes[0];

            Array.Copy(new_fishes, fishes, 9);
        }

        public override void Run()
        {
            Init(1,3,4,1,1,1,1,1,1,1,1,2,2,1,4,2,4,1,1,1,1,1,5,4,1,1,2,1,1,1,1,4,1,1,1,4,4,1,1,1,1,1,1,1,
                2,4,1,3,1,1,2,1,2,1,1,4,1,1,1,4,3,1,3,1,5,1,1,3,4,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,5,2,5,
                5,3,2,1,5,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,5,1,1,1,1,5,1,1,1,1,1,4,1,1,1,1,1,3,1,1,1,1,1,
                1,1,1,1,1,1,3,1,2,4,1,5,5,1,1,5,3,4,4,4,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,5,3,1,4,1,1,2,2,
                1,2,2,5,1,1,1,2,1,1,1,1,3,4,5,1,2,1,1,1,1,1,5,2,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,4,1,5,1,1,
                1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,5,4,5,1,1,1,1,1,1,1,5,1,1,3,1,1,1,3,1,4,2,1,5,1,3,5,5,2,1,
                3,1,1,1,1,1,3,1,3,1,1,2,4,3,1,4,2,2,1,1,1,1,1,1,1,5,2,1,1,1,2);

            for(int day = 0; day < 256; day++)
            {
                Evolve();
            }

            Console.WriteLine($"{fishes.Sum()}");
        }
    }
}
