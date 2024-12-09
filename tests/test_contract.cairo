use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use pixelwar::IPixelWarDispatcher;
use pixelwar::IPixelWarDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {

    let admin_address : ContractAddress = 'admin'.try_into().unwrap();
    println!("admin_address: {:?}", admin_address);
    let contract = declare(name).unwrap().contract_class();
    let mut calldata = array![];
    admin_address.serialize(ref calldata);
    println!("calldata: {:?}", calldata);
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    println!("Passed: ");

    contract_address
}

#[test]
fn test_change_color() {
    let contract_address = deploy_contract("PixelWar");

    let dispatcher = IPixelWarDispatcher { contract_address };
    let initial_color = dispatcher.getPixel(0, 0);
    assert!(initial_color == (255, 255, 255), "Not the expected color");

    dispatcher.changeColor((0, 0, 0), 0, 0);

    assert!(dispatcher.getPixel(0, 0) == (0, 0, 0), "Not the expected color");
}

#[test]
fn test_reset_map() {
    let contract_address = deploy_contract("PixelWar");

    let dispatcher = IPixelWarDispatcher { contract_address };
    dispatcher.changeColor((0, 0, 0), 0, 0);
    dispatcher.changeColor((0, 0, 0), 1, 1);
    dispatcher.changeColor((0, 0, 0), 2, 2);

    dispatcher.reset();

    assert!(dispatcher.getPixel(0, 0) == (255, 255, 255), "Not the expected color");
    assert!(dispatcher.getPixel(1, 1) == (255, 255, 255), "Not the expected color");
    assert!(dispatcher.getPixel(2, 2) == (255, 255, 255), "Not the expected color");
}
