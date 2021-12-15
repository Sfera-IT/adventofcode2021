namespace AoC2021.Extensions
{
    public class Accumulator<T>
    {
        private T[] _storage;
        private int _currentPosition = 0;
        public Accumulator(int size)
        {
            _storage = new T[size];
        }

        public Accumulator<T> Add(T element)
        {
            _storage[_currentPosition++ % _storage.Length] = element;
            return this;
        }

        public T[] AsArray => _storage;
    }
}
