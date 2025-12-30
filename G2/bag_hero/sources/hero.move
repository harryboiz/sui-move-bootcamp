module bag_hero::hero;

use std::string::String;
use sui::bag::{Self, Bag};

public struct Fire has copy, drop, store ()
public struct Water has copy, drop, store ()
public struct Earth has copy, drop, store ()
public struct Air has copy, drop, store ()


public struct Hero has key {
    id: UID,
    name: String,
    attributes: Bag,
}

/// @dev Creates a new hero with a given name and default attributes.
/// @param name The name of the hero.
/// @param ctx The transaction context.
/// @return A new hero with a given name and default attributes.
public fun create_hero(name: String, ctx: &mut TxContext): Hero {
    // create a hero with a bag of attributes with default values
    let mut attributes = bag::new(ctx);
    bag::add(&mut attributes, Fire(), 0u16);
    bag::add(&mut attributes, Water(), 0u16);
    bag::add(&mut attributes, Earth(), 0u16);
    bag::add(&mut attributes, Air(), 0u16);

    Hero {
        id: object::new(ctx),
        name,
        attributes,
    }
}

public fun increase_fire_attribute(hero: &mut Hero, amount: u16) {
    // update the fire attribute
    if (hero.attributes.contains(Fire())) {
        let level = bag::borrow_mut<Fire, u16>(&mut hero.attributes, Fire());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Fire(), amount);
    }
}

// create the other increase functions

public fun get_fire_attribute(hero: &Hero): u16 {
    // get the fire attribute value
    if (hero.attributes.contains(Fire())) {
        let level = bag::borrow<Fire, u16>(&hero.attributes, Fire());
        *level
    } else {
        0
    }
}

public fun increase_water_attribute(hero: &mut Hero, amount: u16) {
    // update the water attribute
    if (hero.attributes.contains(Water())) {
        let level = bag::borrow_mut<Water, u16>(&mut hero.attributes, Water());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Water(), amount);
    }
}

public fun get_water_attribute(hero: &Hero): u16 {
    // get the water attribute value
    if (hero.attributes.contains(Water())) {
        let level = bag::borrow<Water, u16>(&hero.attributes, Water());
        *level
    } else {
        0
    }
}

public fun increase_earth_attribute(hero: &mut Hero, amount: u16) {
    // update the earth attribute
    if (hero.attributes.contains(Earth())) {
        let level = bag::borrow_mut<Earth, u16>(&mut hero.attributes, Earth());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Earth(), amount);
    }
}

public fun get_earth_attribute(hero: &Hero): u16 {
    // get the earth attribute value
    if (hero.attributes.contains(Earth())) {
        let level = bag::borrow<Earth, u16>(&hero.attributes, Earth());
        *level
    } else {
        0
    }
}

public fun increase_air_attribute(hero: &mut Hero, amount: u16) {
    // update the air attribute
    if (hero.attributes.contains(Air())) {
        let level = bag::borrow_mut<Air, u16>(&mut hero.attributes, Air());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Air(), amount);
    }
}

public fun get_air_attribute(hero: &Hero): u16 {
    // get the air attribute value
    if (hero.attributes.contains(Air())) {
        let level = bag::borrow<Air, u16>(&hero.attributes, Air());
        *level
    } else {
        0
    }
}

// create the other get functions

public fun transfer_hero(hero: Hero, to: address) {
    transfer::transfer(hero, to);
}

// Test Only

#[test_only]
use sui::test_utils::{assert_eq, destroy};

#[test]
public fun test_create_hero_and_increase_attributes() {
    let mut hero = create_hero(b"Hero".to_string(), &mut tx_context::dummy());

    assert_eq(hero.attributes.length(), 4);

    assert_eq(hero.attributes.contains_with_type<Fire, u16>(Fire()), true);
    assert_eq(hero.attributes.contains_with_type<Water, u16>(Water()), true);
    assert_eq(hero.attributes.contains_with_type<Earth, u16>(Earth()), true);
    assert_eq(hero.attributes.contains_with_type<Air, u16>(Air()), true);

    assert_eq(get_fire_attribute(&hero), 0);
    assert_eq(get_water_attribute(&hero), 0);
    assert_eq(get_earth_attribute(&hero), 0);
    assert_eq(get_air_attribute(&hero), 0);

    increase_fire_attribute(&mut hero, 10);
    increase_water_attribute(&mut hero, 20);
    increase_earth_attribute(&mut hero, 30);
    increase_air_attribute(&mut hero, 40);

    assert_eq(get_fire_attribute(&hero), 10);
    assert_eq(get_water_attribute(&hero), 20);
    assert_eq(get_earth_attribute(&hero), 30);
    assert_eq(get_air_attribute(&hero), 40);

    destroy(hero);
}