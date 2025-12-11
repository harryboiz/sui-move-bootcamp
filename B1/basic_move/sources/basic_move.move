module basic_move::basic_move;

use std::debug;
use sui::hex;

public struct Hero has key, store {
    id: UID,
}

public struct InsignificantWeapon has drop, store {
    power: u8,
}

public fun mint_hero(ctx: &mut TxContext): Hero {
    let hero = Hero { id: object::new(ctx) };
    hero
}

public fun create_insignificant_weapon(power: u8): InsignificantWeapon {
    InsignificantWeapon { power }
}

// ===== TEST ONLY =====

#[test_only]
use sui::{test_scenario as ts, test_utils::{destroy}};
#[test_only]
use std::unit_test::assert_eq;

#[test_only]
const USER: address = @0xCC;

#[test]
fun test_mint() {
    let mut ts = ts::begin(USER);
    
    let hero = mint_hero(ts.ctx());

    transfer::public_transfer(hero, USER);
    
    ts.end();
}

#[test]
fun test_drop_semantics() {
    let ts = ts::begin(USER);

    let _weapon = create_insignificant_weapon(10);

    ts.end();
}
