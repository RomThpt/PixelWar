#[starknet::interface]
pub trait IPixelWar<TContractState> {
    fn changeColor(ref self: TContractState, color: (u32, u32, u32), i: u32, j: u32);
    fn changeEnd(ref self: TContractState);
    fn reset(ref self: TContractState);
    fn getPixel(self: @TContractState, i: u32, j: u32) -> (u32, u32, u32);
    fn getStatus(self: @TContractState) -> bool;
}

#[starknet::contract]
pub mod PixelWar {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl InternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        map: Map<u32, Map<u32, (u32, u32, u32)>>,
        end: bool,
        interval: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ChangeColor: ChangeColor,
        Reset: Reset,
        End : End,
        #[flat]
        OwnableEvent: OwnableComponent::Event
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

    #[derive(Drop, starknet::Event)]
    struct End {
        #[key]
        sender: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.end.write(true);
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
                j+=1;
            };
            i+=1;
        };
    }

    #[abi(embed_v0)]
    impl PixelwarImpl of super::IPixelWar<ContractState> {
        fn changeColor(ref self: ContractState, color: (u32, u32, u32), i: u32, j: u32) {
            assert!(self.end.read(), "Game ended");
            let sender = get_caller_address();
            self.map.entry(i).entry(j).write(color);
            self.emit(Event::ChangeColor(ChangeColor { sender: sender, color: color, i: i, j: j }));
        }
        fn changeEnd(ref self: ContractState) {
            self.ownable.assert_only_owner();
            self.end.write(true);
            self.emit(Event::End(End { sender: get_caller_address() }));
        }

        fn reset(ref self: ContractState) {
            self.ownable.assert_only_owner();
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
                    j+=1;
                };
                i+=1;
            };
            self.emit(Event::Reset(Reset { sender: get_caller_address() }));
        }
        fn getPixel(self: @ContractState, i: u32, j: u32) -> (u32, u32, u32) {
            self.map.entry(i).entry(j).read()
        }
        fn getStatus(self: @ContractState) -> bool {
            self.end.read()
        }
    }
}