using AoC2021.Extensions;

namespace Aoc2021
{
    public static class Program
    {
        private static void Main(string[] _)
        {
            // See https://aka.ms/new-console-template for more information
            var lines = File.ReadAllLines("Data\\input1.txt");

            var result = lines
                .Select(int.Parse)
                .Agglomerate2()
                .Skip(1)
                .Count(val => val.Actual > val.Previous);
            Console.WriteLine($"Result = {result}");

            result = lines
                .Select(int.Parse)
                .AgglomerateX(3)
                .Skip(1)
                .Select(e => e.Sum())
                .Agglomerate2()
                .Count(val => val.Actual > val.Previous);
            Console.WriteLine($"Result = {result}");

            Console.ReadKey();
        }
    }
}