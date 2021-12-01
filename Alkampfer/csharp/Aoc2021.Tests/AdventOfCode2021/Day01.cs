using AoC2021.Extensions;
using NUnit.Framework;
using System.IO;
using System.Linq;

namespace Aoc2021.Tests.AdventOfCode2021
{
    [TestFixture]
    public class Day01
    {
        [Test]
        public void First_part()
        {
            var lines = File.ReadAllLines("AdventOfCode2021\\Data\\input1.txt");

            var result = lines
                .Select(int.Parse)
                .Agglomerate2()
                .Skip(1)
                .Count(val => val.Actual > val.Previous);
            Assert.That(result, Is.EqualTo(1692));
        }

        [Test]
        public void Second_part()
        {
            var lines = File.ReadAllLines("AdventOfCode2021\\Data\\input1.txt");

            var result = lines
                .Select(int.Parse)
                .AgglomerateX(3)
                .Skip(3)
                .Select(e => e.Sum())
                .Agglomerate2()
                .Count(val => val.Actual > val.Previous);
            Assert.That(result, Is.EqualTo(1724));
        }
    }
}
