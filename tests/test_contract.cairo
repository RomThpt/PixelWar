use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use pixelwar::IPixelWarDispatcher;
use pixelwar::IPixelWarDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
        println!("Error2?");
    let (contract_address, _) = contract.deploy(@array![]).unwrap();
    println!("Error2?");
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
