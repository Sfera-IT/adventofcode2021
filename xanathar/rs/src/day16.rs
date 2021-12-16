use std::iter::Iterator;
use std::collections::VecDeque;

const INPUT: &str = "A20D5CECBD6C061006E7801224AF251AEA06D2319904921880113A931A1402A9D83D43C9FFCC1E56FF29890E00C42984337BF22C502008C26982801009426937320124E602BC01192F4A74FD7B70692F4A74FD7B700403170400F7002DC00E7003C400B0023700082C601DF8C00D30038005AA0013F40044E7002D400D10030C008000574000AB958B4B8011074C0249769913893469A72200B42673F26A005567FCC13FE673004F003341006615421830200F4608E7142629294F92861A840118F1184C0129637C007C24B19AA2C96335400013B0C0198F716213180370AE39C7620043E0D4788B440232CB34D80260008645C86D16C401B85D0BA2D18025A00ACE7F275324137FD73428200ECDFBEFF2BDCDA70D5FE5339D95B3B6C98C1DA006772F9DC9025B057331BF7D8B65108018092599C669B4B201356763475D00480010E89709E090002130CA28C62300265C188034BA007CA58EA6FB4CDA12799FD8098021400F94A6F95E3ECC73A77359A4EFCB09CEF799A35280433D1BCCA666D5EFD6A5A389542A7DCCC010958D85EC0119EED04A73F69703669466A048C01E14FFEFD229ADD052466ED37BD8B4E1D10074B3FF8CF2BBE0094D56D7E38CADA0FA80123C8F75F9C764D29DA814E4693C4854C0118AD3C0A60144E364D944D02C99F4F82100607600AC8F6365C91EC6CBB3A072C404011CE8025221D2A0337158200C97001F6978A1CE4FFBE7C4A5050402E9ECEE709D3FE7296A894F4C6A75467EB8959F4C013815C00FACEF38A7297F42AD2600B7006A0200EC538D51500010B88919624CE694C0027B91951125AFF7B9B1682040253D006E8000844138F105C0010D84D1D2304B213007213900D95B73FE914CC9FCBFA9EEA81802FA0094A34CA3649F019800B48890C2382002E727DF7293C1B900A160008642B87312C0010F8DB08610080331720FC580";

fn expand_hex(b: u8) -> impl Iterator<Item=&'static u8> {
    match b {
        b'0' => [0, 0, 0, 0].iter(),
        b'1' => [0, 0, 0, 1].iter(),
        b'2' => [0, 0, 1, 0].iter(),
        b'3' => [0, 0, 1, 1].iter(),
        b'4' => [0, 1, 0, 0].iter(),
        b'5' => [0, 1, 0, 1].iter(),
        b'6' => [0, 1, 1, 0].iter(),
        b'7' => [0, 1, 1, 1].iter(),
        b'8' => [1, 0, 0, 0].iter(),
        b'9' => [1, 0, 0, 1].iter(),
        b'A' => [1, 0, 1, 0].iter(),
        b'B' => [1, 0, 1, 1].iter(),
        b'C' => [1, 1, 0, 0].iter(),
        b'D' => [1, 1, 0, 1].iter(),
        b'E' => [1, 1, 1, 0].iter(),
        b'F' => [1, 1, 1, 1].iter(),
        _ => panic!("not an hex")
    }
}

struct BitStream(VecDeque<u8>, bool);
impl BitStream {
    pub fn from_string(s: &str) -> Self {
        Self(s.as_bytes().iter().flat_map(|h| expand_hex(*h)).copied().collect::<VecDeque<u8>>(), false)
    }

    pub fn read(&mut self, bit_count: u32) -> u32 {
        let mut res = 0u32;

        for _ in 0..bit_count {
            res = (res << 1) | (self.0.pop_front().unwrap() as u32);
        }

        res
    }

    pub fn read_substream(&mut self, bit_count: u32) -> Self {
        let mut q = VecDeque::new();
        for _ in 1..=bit_count {
            q.push_back(self.0.pop_front().unwrap());
        }
        Self(q, true)
    }

    pub fn has_pending_packet(&self) -> bool {
        self.0.len() >= 10
    }
}

#[derive(Copy, Clone, PartialEq, Eq)]
enum PacketType {
    Sum = 0,
    Mul = 1,
    Min = 2,
    Max = 3,
    Num = 4,
    Gt = 5,
    Lt = 6,
    Eq = 7,
}

struct Header {
    version: u32,
    packet_type: PacketType,
}

impl Header {
    pub fn read(bits: &mut BitStream) -> Header {
        let version = bits.read(3);
        let packet_type = match bits.read(3) {
            x if x == (PacketType::Sum as u32) => PacketType::Sum,
            x if x == (PacketType::Mul as u32) => PacketType::Mul,
            x if x == (PacketType::Min as u32) => PacketType::Min,
            x if x == (PacketType::Max as u32) => PacketType::Max,
            x if x == (PacketType::Num as u32) => PacketType::Num,
            x if x == (PacketType::Gt as u32) => PacketType::Gt,
            x if x == (PacketType::Lt as u32) => PacketType::Lt,
            x if x == (PacketType::Eq as u32) => PacketType::Eq,
            _ => panic!("Unknown packet type"),
        };

        Header { version, packet_type }
    }
}

trait Packet {
    fn version_sum(&self) -> u32;
    fn eval(&self) -> u128;
}

struct Literal {
    header: Header,
    value: u128,
}
impl Literal {
    pub fn read(header: Header, bits: &mut BitStream) -> Self {
        let mut value = 0u128;

        loop {
            let cont = bits.read(1);
            value = (value << 4) | (bits.read(4) as u128);
            if cont == 0 {
                break Literal { header, value }
            }
        }
    }
}
impl Packet for Literal {
    fn version_sum(&self) -> u32 { self.header.version }
    fn eval(&self) -> u128 { self.value }
}

struct Operator {
    header: Header,
    packets: Vec<Box<dyn Packet>>,
}
impl Operator {
    pub fn read(header: Header, bits: &mut BitStream) -> Self {
        let mut packets = Vec::new();

        if bits.read(1) == 0 {
            let bit_len = bits.read(15);
            let mut substr = bits.read_substream(bit_len);

            while substr.has_pending_packet() {
                packets.push(dispatch_packet(&mut substr));
            }
        } else {
            let subpackets = bits.read(11);

            for _ in 1..=subpackets {
                packets.push(dispatch_packet(bits));
            }
        }

        Self { header, packets }
    }
}
impl Packet for Operator {
    fn version_sum(&self) -> u32 {
        self.header.version + self.packets.iter().map(|p| p.version_sum()).sum::<u32>()
    }

    fn eval(&self) -> u128 {
        match self.header.packet_type {
            PacketType::Sum => self.packets.iter().map(|p| p.eval()).sum(),
            PacketType::Mul => self.packets.iter().map(|p| p.eval()).product(),
            PacketType::Min => self.packets.iter().map(|p| p.eval()).min().unwrap(),
            PacketType::Max => self.packets.iter().map(|p| p.eval()).max().unwrap(),
            PacketType::Num => panic!("Unexpected num"),
            PacketType::Gt  => if self.packets[0].eval() > self.packets[1].eval() { 1 } else { 0 },
            PacketType::Lt  => if self.packets[0].eval() < self.packets[1].eval() { 1 } else { 0 },
            PacketType::Eq  => if self.packets[0].eval() == self.packets[1].eval() { 1 } else { 0 },
        }
    }
}

fn dispatch_packet(bits: &mut BitStream) -> Box<dyn Packet> {

    let header = Header::read(bits);

    if header.packet_type == PacketType::Num {
        Box::new(Literal::read(header, bits))
    } else {
        Box::new(Operator::read(header, bits))
    }
}


pub fn test1() {
    let mut bits = BitStream::from_string(INPUT);

    while bits.has_pending_packet() {
        let p = dispatch_packet(&mut bits);
        println!("SUM => {}", p.version_sum());
    }
}

pub fn test2() {
    let mut bits = BitStream::from_string(INPUT);

    while bits.has_pending_packet() {
        let p = dispatch_packet(&mut bits);
        println!("EVAL => {}", p.eval());
    }
}
