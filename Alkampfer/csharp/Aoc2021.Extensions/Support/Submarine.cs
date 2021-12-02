namespace AoC2021.Extensions.Support;

public class Submarine
{
    public int Horizontal { get; set; }
    public int Depth { get; set; }
    public int Aim { get; set; }
}

public abstract class CommandBase {
    public abstract void ExecuteCommand(Submarine submarine);
}

public class Forward : CommandBase 
{
    private readonly int value;

    public Forward(int value)
    {
        this.value = value;
    }

    public override void ExecuteCommand(Submarine submarine)
    {
        submarine.Horizontal += value;
        submarine.Depth += submarine.Aim * value;
    }
}

public class Down : CommandBase 
{
    private readonly int value;

    public Down(int value)
    {
        this.value = value;
    }

    public override void ExecuteCommand(Submarine submarine)
    {
        submarine.Aim += value;
    }
}

public class Up : CommandBase 
{
    private readonly int value;

    public Up(int value)
    {
        this.value -= value;
    }

    public override void ExecuteCommand(Submarine submarine)
    {
        submarine.Aim += value;
    }
}

public class Parser {
    
    private Dictionary<string, Func<int, CommandBase>> factories = 
        new Dictionary<string, Func<int, CommandBase>> {
        ["forward"] = v => new Forward(v),
        ["down"] = v => new Down(v),
        ["up"] = v => new Up(v),
    };

    public IEnumerable<CommandBase> Parse(string[] lines) {
        
        return lines
            .Select(s => s.Split())
            .Select(s => factories[s[0]](int.Parse(s[1])));
    }
}

