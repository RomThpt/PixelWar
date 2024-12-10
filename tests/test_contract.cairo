use starknet::ContractAddress;

use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, spy_events,
    EventSpyTrait,  start_cheat_caller_address_global,
    stop_cheat_caller_address_global
};

use pixelwar::IPixelWarDispatcher;
use pixelwar::IPixelWarDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {

    let admin_address : ContractAddress = 'admin'.try_into().unwrap();
    let contract = declare(name).unwrap().contract_class();
    let mut calldata = array![];
    admin_address.serialize(ref calldata);
    let (contract_address, _) = contract.deploy(@calldata).unwrap();

    contract_address
}

#[test]
fn test_change_color() {
    let contract_address = deploy_contract("PixelWar");
    let dispatcher = IPixelWarDispatcher { contract_address };
    let initial_color = dispatcher.getPixel(0, 0);

    assert!(initial_color == (255, 255, 255), "Not initial color");

    dispatcher.changeColor((0, 0, 0), 0, 0);

    assert!(dispatcher.getPixel(0, 0) == (0, 0, 0), "Not the expected color");
}

#[test]
fn test_reset_map() {
    let contract_address = deploy_contract("PixelWar");

    let dispatcher = IPixelWarDispatcher { contract_address };
    let mut i: u32 = 0;
    let mut j: u32 = 0;
    loop {
        if(i == 1000) {
            break;
        }
        loop {
            if(j == 1000) {
                break;
            }
        dispatcher.changeColor((0, 0, 0), i, j);
        j+=1;
        };
        i+=1;
    };
    
    let admin_address : ContractAddress = 'admin'.try_into().unwrap();
    start_cheat_caller_address_global(admin_address);

   dispatcher.reset();

    loop {
        if(i == 10) {
            break;
        }
        loop {
            if(j == 10) {
                break;
            }
            println!("{:?}", dispatcher.getPixel(i, j));
            assert!(dispatcher.getPixel(i, j) == (255, 255, 255), "Not the expected color");
            j+=1;
        };
        i+=1;
    };
    stop_cheat_caller_address_global();
}

#[test]
fn test_not_owner_reset() {
    let contract_address = deploy_contract("PixelWar");

    let dispatcher = IPixelWarDispatcher { contract_address };
       
    dispatcher.changeColor((0, 0, 0), 0, 0);



}

#[test]
fn test_change_end() {
    let contract_address = deploy_contract("PixelWar");

    let dispatcher = IPixelWarDispatcher { contract_address };
    let mut spy = spy_events();
    start_cheat_caller_address_global('admin'.try_into().unwrap());
    dispatcher.changeEnd();
    let events = spy.get_events();
    let (from, event) = events.events.at(0);
    assert(from == @contract_address, 'Emitted from wrong address');
    assert(event.keys.at(0) == @selector!("End"), 'Wrong event name'); // Ad 4.
    assert(event.data.len() == 0, 'There should be no data');
    
    assert!(dispatcher.getPixel(0, 0) == (255, 255, 255), "Not the expected color");
    stop_cheat_caller_address_global();
}