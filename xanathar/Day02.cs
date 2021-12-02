using System;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using Helpers;

namespace Day02
{
    enum CommandType
    {
        Forward,
        Depth,
    }

    class Command
    {
        public int Num;
        public CommandType Cmd;

        public static Command Parse(string s)
        {
            string[] parts = s.Split(' ');
            CommandType type = CommandType.Depth;
            int num = int.Parse(parts[1]);

            if (parts[0] == "forward") type = CommandType.Forward;
            else if (parts[0] == "down") type = CommandType.Depth;
            else if (parts[0] == "up") { type = CommandType.Depth; num = -num; }

            return new Command
            {
                Num = num,
                Cmd = type,
            };
        }
    }


    public class Test1 : DayBase
    {
        public override void Run()
        {
            var data = File.ReadAllLines("data/day2.txt").Where(s => !string.IsNullOrEmpty(s)).Select(s => Command.Parse(s)).ToArray();

            int depth = 0, pos = 0;

            foreach (Command c in data)
            {
                if (c.Cmd == CommandType.Forward) pos += c.Num;
                else depth += c.Num;
            }

            Console.WriteLine("{0}p x {1}d = {2}", pos, depth, pos * depth);
        }
    }

    public class Test2 : DayBase
    {
        public override void Run()
        {
            var data = File.ReadAllLines("data/day2.txt").Where(s => !string.IsNullOrEmpty(s)).Select(s => Command.Parse(s)).ToArray();

            int aim = 0, pos = 0, depth = 0;

            foreach (Command c in data)
            {
                if (c.Cmd == CommandType.Forward)
                {
                    pos += c.Num;
                    depth += c.Num * aim;
                }
                else
                {
                    aim += c.Num;
                }
            }

            Console.WriteLine("{0}p x {1}d = {2}", pos, depth, pos * depth);
        }
    }
}
