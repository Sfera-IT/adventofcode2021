using System;

public abstract class DayBase
{
    public abstract void Run();
}


class Program
{
    static DayBase CreateDay(string test)
    {
        if (test == "1a") return new Day01.Test1();
        else if (test == "2a") return new Day02.Test1();
        else if (test == "3a") return new Day03.Test1();
        else if (test == "4a") return new Day04.Test1();
        else if (test == "5a") return new Day05.Test1();
        else if (test == "6a") return new Day06.Test1();
        else if (test == "7a") return new Day07.Test1();
        else if (test == "8a") return new Day08.Test1();
        else if (test == "9a") return new Day09.Test1();
        else if (test == "10a") return new Day10.Test1();
        else if (test == "11a") return new Day11.Test1();
        else if (test == "12a") return new Day12.Test1();
        else if (test == "13a") return new Day13.Test1();
        else if (test == "14a") return new Day14.Test1();
        else if (test == "15a") return new Day15.Test1();
        else if (test == "16a") return new Day16.Test1();
        else if (test == "17a") return new Day17.Test1();
        else if (test == "18a") return new Day18.Test1();
        else if (test == "19a") return new Day19.Test1();
        else if (test == "20a") return new Day20.Test1();
        else if (test == "21a") return new Day21.Test1();
        else if (test == "22a") return new Day22.Test1();
        else if (test == "23a") return new Day23.Test1();
        else if (test == "24a") return new Day24.Test1();
        else if (test == "25a") return new Day25.Test1();
        else if (test == "1b") return new Day01.Test2();
        else if (test == "2b") return new Day02.Test2();
        else if (test == "3b") return new Day03.Test2();
        else if (test == "4b") return new Day04.Test2();
        else if (test == "5b") return new Day05.Test2();
        else if (test == "6b") return new Day06.Test2();
        else if (test == "7b") return new Day07.Test2();
        else if (test == "8b") return new Day08.Test2();
        else if (test == "9b") return new Day09.Test2();
        else if (test == "10b") return new Day10.Test2();
        else if (test == "11b") return new Day11.Test2();
        else if (test == "12b") return new Day12.Test2();
        else if (test == "13b") return new Day13.Test2();
        else if (test == "14b") return new Day14.Test2();
        else if (test == "15b") return new Day15.Test2();
        else if (test == "16b") return new Day16.Test2();
        else if (test == "17b") return new Day17.Test2();
        else if (test == "18b") return new Day18.Test2();
        else if (test == "19b") return new Day19.Test2();
        else if (test == "20b") return new Day20.Test2();
        else if (test == "21b") return new Day21.Test2();
        else if (test == "22b") return new Day22.Test2();
        else if (test == "23b") return new Day23.Test2();
        else if (test == "24b") return new Day24.Test2();
        else if (test == "25b") return new Day25.Test2();
        else return null;
    }

    static void Usage()
    {
        Console.WriteLine($"Usage: <day+phase>");
        Console.WriteLine("   <day+phase> : 1a, 1b, 2a, 2b ... 25a, 25b");
        System.Environment.Exit(1);
    }

    static void Main(string[] args)
    {
        if (args.Length < 1)
            Usage();

        DayBase d = CreateDay(args[0]);

        if (d == null)
            Usage();

        d.Run();
    }
}
