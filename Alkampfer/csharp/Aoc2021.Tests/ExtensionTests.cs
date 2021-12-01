using AoC2021.Extensions;
using NUnit.Framework;

namespace Aoc2021.Tests
{
    [TestFixture]
    public class ExtensionTests
    {
        [Test]
        public void Accumulate2_basic_test()
        {
            int[] test = { 1, 2, 3 };
            Assert.That(
                test.Agglomerate2(),
                Is.EquivalentTo(new[] {
                    (1, 0),
                    (2, 1),
                    (3, 2),
                }));
        }

        [Test]
        public void AccumulateX_test_2()
        {
            int[] test = { 1, 2, 3, 4 };
            Assert.That(
                test.AgglomerateX(2),
                Is.EquivalentTo(new[] {
                    new [] {1, 0 },
                    new [] {1, 2 },
                    new [] {3, 2 },
                    new [] {3, 4 },
                }));
        }

        [Test]
        public void AccumulateX_test_3()
        {
            int[] test = { 1, 2, 3, 4 };
            Assert.That(
                test.AgglomerateX(3),
                Is.EquivalentTo(new[] {
                    new [] {1, 0, 0 },
                    new [] {1, 2, 0 },
                    new [] {1, 2, 3},
                    new [] {4, 2, 3},
                }));
        }
    }
}
