module option_hero::hero;

use std::option::{some, none};
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

/// @dev Creates a new hero with a given name and an empty bag of attributes.
/// @param name The name of the hero.
/// @param ctx The transaction context.
/// @return A new hero with a given name and an empty bag of attributes.
public fun create_hero(name: String, ctx: &mut TxContext): Hero {
    Hero {
        id: object::new(ctx),
        name,
        attributes: bag::new(ctx),
    }
}

public fun increase_fire_attribute(hero: &mut Hero, amount: u16) {
    // increase the fire attribute, create it if it doesn't exist
    if (hero.attributes.contains(Fire())) {
        let level = bag::borrow_mut<Fire, u16>(&mut hero.attributes, Fire());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Fire(), amount);
    }
}

// create the other increase functions

public fun get_fire_attribute(hero: &Hero): Option<u16> {
    // get the fire attribute value, if present
    if (hero.attributes.contains(Fire())) {
        let level = bag::borrow<Fire, u16>(&hero.attributes, Fire());
        some(*level)
    } else {
        none()
    }
}

public fun increase_water_attribute(hero: &mut Hero, amount: u16) {
    // increase the water attribute, create it if it doesn't exist
    if (hero.attributes.contains(Water())) {
        let level = bag::borrow_mut<Water, u16>(&mut hero.attributes, Water());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Water(), amount);
    }
}

public fun get_water_attribute(hero: &Hero): Option<u16> {
    // get the water attribute value, if present
    if (hero.attributes.contains(Water())) {
        let level = bag::borrow<Water, u16>(&hero.attributes, Water());
        some(*level)
    } else {
        none()
    }
}

public fun increase_earth_attribute(hero: &mut Hero, amount: u16) {
    // increase the earth attribute, create it if it doesn't exist
    if (hero.attributes.contains(Earth())) {
        let level = bag::borrow_mut<Earth, u16>(&mut hero.attributes, Earth());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Earth(), amount);
    }
}

public fun get_earth_attribute(hero: &Hero): Option<u16> {
    // get the earth attribute value, if present
    if (hero.attributes.contains(Earth())) {
        let level = bag::borrow<Earth, u16>(&hero.attributes, Earth());
        some(*level)
    } else {
        none()
    }
}

public fun increase_air_attribute(hero: &mut Hero, amount: u16) {
    // increase the air attribute, create it if it doesn't exist
    if (hero.attributes.contains(Air())) {
        let level = bag::borrow_mut<Air, u16>(&mut hero.attributes, Air());
        *level = *level + amount;
    } else {
        bag::add(&mut hero.attributes, Air(), amount);
    }
}

public fun get_air_attribute(hero: &Hero): Option<u16> {
    // get the air attribute value, if present
    if (hero.attributes.contains(Air())) {
        let level = bag::borrow<Air, u16>(&hero.attributes, Air());
        some(*level)
    } else {
        none()
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

    assert_eq(hero.attributes.length(), 0);

    increase_water_attribute(&mut hero, 20);
    increase_air_attribute(&mut hero, 40);

    assert_eq(get_fire_attribute(&hero), none());
    assert_eq(get_water_attribute(&hero), some(20));
    assert_eq(get_earth_attribute(&hero), none());
    assert_eq(get_air_attribute(&hero), some(40));

    destroy(hero);
}
