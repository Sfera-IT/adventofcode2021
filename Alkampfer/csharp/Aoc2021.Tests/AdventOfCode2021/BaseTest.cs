using System.IO;
using NUnit.Framework;

namespace Aoc2021.Tests.AdventOfCode2021
{
    [TestFixture]
    public class BaseTest 
    {
        protected BaseTest(int day)
        {
            _day = day;
        }
        
        protected int _expected1;
        protected int _expected2;
        private readonly int _day;

        [OneTimeSetUp]
        public void OneTimeSetUp() {

            var lines = File.ReadAllLines("AdventOfCode2021/Data/expectedresults.txt");
            var line = lines[_day - 1];
            var expected = line.Split(' ');
            _expected1 = int.Parse(expected[0]);
            _expected2 = int.Parse(expected[1]);
        }
    }
}