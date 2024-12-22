export const ABI = [
    {
        type: "impl",
        name: "PixelwarImpl",
        interface_name: "pixelwar::IPixelWar",
    },
    {
        type: "enum",
        name: "core::bool",
        variants: [
            {
                name: "False",
                type: "()",
            },
            {
                name: "True",
                type: "()",
            },
        ],
    },
    {
        type: "interface",
        name: "pixelwar::IPixelWar",
        items: [
            {
                type: "function",
                name: "changeColor",
                inputs: [
                    {
                        name: "color",
                        type: "(core::integer::u32, core::integer::u32, core::integer::u32)",
                    },
                    {
                        name: "i",
                        type: "core::integer::u32",
                    },
                    {
                        name: "j",
                        type: "core::integer::u32",
                    },
                ],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "changeEnd",
                inputs: [],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "reset",
                inputs: [],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "getPixel",
                inputs: [
                    {
                        name: "i",
                        type: "core::integer::u32",
                    },
                    {
                        name: "j",
                        type: "core::integer::u32",
                    },
                ],
                outputs: [
                    {
                        type: "(core::integer::u32, core::integer::u32, core::integer::u32)",
                    },
                ],
                state_mutability: "view",
            },
            {
                type: "function",
                name: "getStatus",
                inputs: [],
                outputs: [
                    {
                        type: "core::bool",
                    },
                ],
                state_mutability: "view",
            },
            {
                type: "function",
                name: "getMap",
                inputs: [],
                outputs: [
                    {
                        type: "core::array::Array::<core::array::Array::<(core::integer::u32, core::integer::u32, core::integer::u32)>>",
                    },
                ],
                state_mutability: "view",
            },
        ],
    },
    {
        type: "impl",
        name: "OwnableMixinImpl",
        interface_name: "openzeppelin_access::ownable::interface::OwnableABI",
    },
    {
        type: "interface",
        name: "openzeppelin_access::ownable::interface::OwnableABI",
        items: [
            {
                type: "function",
                name: "owner",
                inputs: [],
                outputs: [
                    {
                        type: "core::starknet::contract_address::ContractAddress",
                    },
                ],
                state_mutability: "view",
            },
            {
                type: "function",
                name: "transfer_ownership",
                inputs: [
                    {
                        name: "new_owner",
                        type: "core::starknet::contract_address::ContractAddress",
                    },
                ],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "renounce_ownership",
                inputs: [],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "transferOwnership",
                inputs: [
                    {
                        name: "newOwner",
                        type: "core::starknet::contract_address::ContractAddress",
                    },
                ],
                outputs: [],
                state_mutability: "external",
            },
            {
                type: "function",
                name: "renounceOwnership",
                inputs: [],
                outputs: [],
                state_mutability: "external",
            },
        ],
    },
    {
        type: "constructor",
        name: "constructor",
        inputs: [
            {
                name: "owner",
                type: "core::starknet::contract_address::ContractAddress",
            },
        ],
    },
    {
        type: "event",
        name: "pixelwar::PixelWar::ChangeColor",
        kind: "struct",
        members: [
            {
                name: "sender",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
            {
                name: "color",
                type: "(core::integer::u32, core::integer::u32, core::integer::u32)",
                kind: "data",
            },
            {
                name: "i",
                type: "core::integer::u32",
                kind: "data",
            },
            {
                name: "j",
                type: "core::integer::u32",
                kind: "data",
            },
        ],
    },
    {
        type: "event",
        name: "pixelwar::PixelWar::Reset",
        kind: "struct",
        members: [
            {
                name: "sender",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
        ],
    },
    {
        type: "event",
        name: "pixelwar::PixelWar::End",
        kind: "struct",
        members: [
            {
                name: "sender",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
        ],
    },
    {
        type: "event",
        name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "struct",
        members: [
            {
                name: "previous_owner",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
            {
                name: "new_owner",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
        ],
    },
    {
        type: "event",
        name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "struct",
        members: [
            {
                name: "previous_owner",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
            {
                name: "new_owner",
                type: "core::starknet::contract_address::ContractAddress",
                kind: "key",
            },
        ],
    },
    {
        type: "event",
        name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "enum",
        variants: [
            {
                name: "OwnershipTransferred",
                type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
                kind: "nested",
            },
            {
                name: "OwnershipTransferStarted",
                type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
                kind: "nested",
            },
        ],
    },
    {
        type: "event",
        name: "pixelwar::PixelWar::Event",
        kind: "enum",
        variants: [
            {
                name: "ChangeColor",
                type: "pixelwar::PixelWar::ChangeColor",
                kind: "nested",
            },
            {
                name: "Reset",
                type: "pixelwar::PixelWar::Reset",
                kind: "nested",
            },
            {
                name: "End",
                type: "pixelwar::PixelWar::End",
                kind: "nested",
            },
            {
                name: "OwnableEvent",
                type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
                kind: "flat",
            },
        ],
    },
] as const;
