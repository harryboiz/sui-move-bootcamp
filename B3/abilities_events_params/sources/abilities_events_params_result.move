module abilities_events_params::abilities_events_params_result;
use std::string::String;
use sui::event;

// MARK: Error Codes

const EMedalOfHonorNotAvailable: u64 = 111;

// MARK: Structs

public struct Hero has key {
    id: UID, // required
    name: String,
    medals: vector<Medal>,
}

public struct Medal has key, store {
    id: UID,
    name: String,
}

public struct MedalStorage has key {
    id: UID,
    medals: vector<Medal>,
}

// MARK: Events

public struct HeroMinted has copy, drop {
    hero_id: ID,
    owner: address,
}

// MARK: Module Initializer

fun init(ctx: &mut TxContext) {
    let medal_of_honor = Medal {
        id: object::new(ctx),
        name: b"Medal of Honor".to_string(),
    };

    let mut medal_storage = MedalStorage {
        id: object::new(ctx),
        medals: vector::empty<Medal>(),
    };

    vector::push_back(&mut medal_storage.medals, medal_of_honor);

    transfer::share_object(medal_storage);
}

public fun mint_hero(name: String, ctx: &mut TxContext): Hero {
    let freshHero = Hero {
        id: object::new(ctx), // creates a new UID
        name,
        medals: vector::empty<Medal>(),
    };

    event::emit(HeroMinted {
            hero_id: object::id(&freshHero),
            owner: ctx.sender(),
        },
    );

    freshHero
}

public fun mint_and_keep_hero(name: String, ctx: &mut TxContext) {
    let hero = mint_hero(name, ctx);
    transfer::transfer(hero, ctx.sender());
}

public fun get_medal_by_name(
    medal_storage: &MedalStorage, 
    medal_name: String, 
    ctx: &mut TxContext
): option::Option<Medal> {
    let len = vector::length(&medal_storage.medals);
    let mut i = 0;
    while (i < len) {
        let medal = vector::borrow(&medal_storage.medals, i);
        if (medal.name == medal_name) {
            return option::some(Medal {
                id: object::new(ctx),
                name: medal_name,
            })
        };
        i = i + 1;
    };
    option::none<Medal>()
}

public fun award_medal_of_honor(
    hero: &mut Hero, 
    medal_storage: &MedalStorage, 
    medal_name: String,
    ctx: &mut TxContext
) {
    let mut medal_option = medal_storage.get_medal_by_name(medal_name, ctx);
    if (option::is_none(&medal_option)) {
        abort EMedalOfHonorNotAvailable
    };
    let medal = option::extract<Medal>(&mut medal_option);
    vector::push_back(&mut hero.medals, medal);
    medal_option.destroy_none();
}

/////// Tests ///////

#[test_only]
use sui::test_scenario as ts;
#[test_only]
use sui::test_scenario::{take_shared, return_shared};
#[test_only]
use sui::test_utils::{destroy};
#[test_only]
use std::unit_test::assert_eq;

//--------------------------------------------------------------
//  Test 1: Hero Creation
//--------------------------------------------------------------
//  Objective: Verify the correct creation of a Hero object.
//  Tasks:
//      1. Complete the test by calling the `mint_hero` function with a hero name.
//      2. Assert that the created Hero's name matches the provided name.
//      3. Properly clean up the created Hero object using `destroy`.
//--------------------------------------------------------------
#[test]
fun test_hero_creation() {
    let mut test = ts::begin(@USER);
    init(test.ctx());
    test.next_tx(@USER);

    //Get hero Registry

    let hero = mint_hero(b"Flash".to_string(), test.ctx());
    assert_eq!(hero.name, b"Flash".to_string());

    destroy(hero);
    test.end();
}

//--------------------------------------------------------------
//  Test 2: Event Emission
//--------------------------------------------------------------
//  Objective: Implement event emission during hero creation and verify its correctness.
//  Tasks:
//      1. Define a `HeroMinted` event struct with appropriate fields (e.g., hero ID, owner address).  Remember to add `copy, drop` abilities!
//      2. Emit the `HeroMinted` event within the `mint_hero` function after creating the Hero.
//      3. In this test, capture emitted events using `event::events_by_type<HeroMinted>()`.
//      4. Assert that the number of emitted `HeroMinted` events is 1.
//      5. Assert that the `owner` field of the emitted event matches the expected address (e.g., @USER).
//--------------------------------------------------------------
#[test]
fun test_event_thrown() { 
    let mut test = ts::begin(@USER);
    init(test.ctx());
    test.next_tx(@USER);

    let hero = mint_hero(b"Batman".to_string(), test.ctx());

    let events = event::events_by_type<HeroMinted>();
    assert_eq!(vector::length(&events), 1);

    let emitted_event = vector::borrow(&events, 0);
    assert_eq!(emitted_event.owner, @USER);

    destroy(hero);
    test.end();
 }

//--------------------------------------------------------------
//  Test 3: Medal Awarding
//--------------------------------------------------------------
//  Objective: Implement medal awarding functionality to heroes and verify its effects.
//  Tasks:
//      1. Define a `Medal` struct with appropriate fields (e.g., medal ID, medal name). Remember to add `key, store` abilities!
//      2. Add a `medals: vector<Medal>` field to the `Hero` struct to store the medals a hero has earned.
//      3. Create functions to award medals to heroes, e.g., `award_medal_of_honor(hero: &mut Hero)`.
//      4. In this test, mint a hero.
//      5. Award a specific medal (e.g., Medal of Honor) to the hero using your `award_medal_of_honor` function.
//      6. Assert that the hero's `medals` vector now contains the awarded medal.
//      7. Consider creating a shared `MedalStorage` object to manage the available medals.
//--------------------------------------------------------------
#[test]
fun test_medal_award() { 
    let mut test = ts::begin(@USER);
    init(test.ctx());
    test.next_tx(@USER);

    let mut hero = mint_hero(b"Superman".to_string(), test.ctx());

    let medal_storage = take_shared<MedalStorage>(&test);

    award_medal_of_honor(&mut hero, &medal_storage, b"Medal of Honor".to_string(), test.ctx());

    assert_eq!(vector::length(&hero.medals), 1);

    return_shared(medal_storage);
    destroy(hero);
    test.end();
}
