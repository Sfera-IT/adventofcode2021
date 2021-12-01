using AoC2021.Extensions;
using NUnit.Framework;

namespace Aoc2021.Tests
{
    [TestFixture]
    public class AccumulatorTests
    {
        [Test]
        public void Verify_basic()
        {
            var accumulator = new Accumulator<int>(3);

            accumulator
                .Add(1)
                .Add(2)
                .Add(3);

            Assert.That(accumulator.AsArray, Is.EquivalentTo(new [] { 1, 2, 3 }));
        }

        [Test]
        public void Verify_rotate()
        {
            var accumulator = new Accumulator<int>(3);

            accumulator
                .Add(1)
                .Add(2)
                .Add(3)
                .Add(4);

            Assert.That(accumulator.AsArray, Is.EquivalentTo(new[] { 4, 2, 3 }));
        }
    }
}