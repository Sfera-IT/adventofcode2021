namespace AoC2021.Extensions
{
    public static class Extensions
    {
        public static IEnumerable<(TSource Actual, TSource? Previous)> Agglomerate2<TSource>(
            this IEnumerable<TSource> source)
        {
            TSource previous = default;
            using (var iterator = source.GetEnumerator())
            {
                while (iterator.MoveNext())
                {
                    yield return (iterator.Current, previous);
                    previous = iterator.Current;
                }
            }
        }

        public static IEnumerable<TSource[]> AgglomerateX<TSource>(
            this IEnumerable<TSource> source,
            int count)
        {
            Accumulator<TSource> accumulator = new Accumulator<TSource>(count);
            using (var iterator = source.GetEnumerator())
            {
                while (iterator.MoveNext())
                {
                    accumulator.Add(iterator.Current);
                    yield return accumulator.AsArray;
                }
            }
        }
    }
}
