using AoC2021.Extensions;
using AoC2021.Extensions.Support;
using NUnit.Framework;
using System.IO;
using System.Linq;

namespace Aoc2021.Tests.AdventOfCode2021
{
    [TestFixture]
    public class Day02 : BaseTest
    {
        public Day02() : base(2)
        {     
        }

        [Test]
        public void First_part()
        {
            var submarine = new Submarine();
            var lines = File.ReadAllLines("AdventOfCode2021/Data/input2.txt"); 
            var parser = new Parser();
            parser
                .Parse(lines)
                .Foreach(a => a.ExecuteCommand(submarine));
            
            Assert.That(submarine.Aim * submarine.Horizontal, Is.EqualTo(_expected1));
                
        }

        [Test]
        public void Second_part()
        {
            var submarine = new Submarine();
            var lines = File.ReadAllLines("AdventOfCode2021/Data/input2.txt"); 
            var parser = new Parser();
            parser
                .Parse(lines)
                .Foreach(a => a.ExecuteCommand(submarine));
            
            Assert.That(submarine.Depth * submarine.Horizontal, Is.EqualTo(_expected2));
        }
    }
}
