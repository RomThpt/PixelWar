#[starknet::interface]
pub trait IPixelWar<TContractState> {
    fn changeColor(ref self: TContractState, color: (u32, u32, u32), i: u32, j: u32);
    fn end(ref self: TContractState);
    fn reset(ref self: TContractState);
    fn getPixel(ref self: TContractState, i: u32, j: u32) -> (u32, u32, u32);
}

#[starknet::contract]
mod PixelWar {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };

    #[storage]
    struct Storage {
        owner: ContractAddress,
        player: ContractAddress,
        map: Map<u32, Map<u32, (u32, u32, u32)>>,
        end: bool,
        interval: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ChangeColor: ChangeColor,
        Reset: Reset,
    }

    #[derive(Drop, starknet::Event)]
    struct ChangeColor {
        #[key]
        sender: ContractAddress,
        color: (u32, u32, u32),
        i: u32,
        j: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct Reset {
        #[key]
        sender: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.owner.write(initial_owner);
        let mut i: u32 = 0;
        let mut j: u32 = 0;
        let white: (u32, u32, u32) = (255, 255, 255);
        loop {
            if (i == 100) {
                break;
            };
            loop {
                if (j == 100) {
                    break;
                }
                self.map.entry(i).entry(j).write(white);
            };
        };
    }

    #[abi(embed_v0)]
    impl PixelwarImpl of super::IPixelWar<ContractState> {
        fn changeColor(ref self: ContractState, color: (u32, u32, u32), i: u32, j: u32) {
            assert!(self.end.read(), "Game ended");
            let sender = get_caller_address();
            self.map.entry(i).entry(j).write(color);
            Event::ChangeColor(ChangeColor { sender: sender, color: color, i: i, j: j });
        }
        fn end(ref self: ContractState) {
            self.end.write(true);
        }

        fn reset(ref self: ContractState) {
            let mut i: u32 = 0;
            let mut j: u32 = 0;
            let white: (u32, u32, u32) = (255, 255, 255);
            loop {
                if (i == 100) {
                    break;
                };
                loop {
                    if (j == 100) {
                        break;
                    }
                    self.map.entry(i).entry(j).write(white);
                };
            };
            Event::Reset(Reset { sender: get_caller_address() });
        }
        fn getPixel(ref self: ContractState, i: u32, j: u32) -> (u32, u32, u32) {
            self.map.entry(i).entry(j).read()
        }
    }
}