module sui_primitives::sui_primitives_result;
#[test_only]
use sui::dynamic_field;
#[test_only]
use sui::dynamic_object_field;
#[test_only]
use std::string::{Self, String};
#[test_only]
use sui::test_scenario;

#[test]
fun test_numbers() {
    let a = 50;
    let b = 50;
    assert!(a == b, 601);
}

#[test]
fun test_overflow() {
    assert!(1000 == 1000u16, 604);
}

#[test]
fun test_mutability() {
    let mut x = 10;
    assert!(x == 10, 600);
    x = 20;
    assert!(x == 20, 602);
}

#[test]
fun test_boolean() {
    let a = true;
    let b = false;
    assert!(a != b, 605);

}

#[test]
fun test_loop() {
    let mut sum = 0;
    let mut i = 1;
    while (i <= 5) {
        sum = sum + i;
        i = i + 1;
    };
    assert!(sum == 15, 606);
}

#[test]
fun test_vector() {
    let mut myVec: vector<u8> = vector[10, 20, 30];

    assert!(myVec.is_empty() == false);

    myVec.push_back(40);

    assert!(myVec.length() == 4, 603);
}

#[test]
fun test_string() {
    let myStringArr: vector<u8> = b"Hello, World!";

    let myString = string::utf8(myStringArr);

    assert!(string::length(&myString) == 13, 602);
}

#[test]
fun test_string2() {
    let myStringArr = b"Hello, World!";
}

public struct Container has key {
    id: UID,
}

public struct Item has key, store {
    id: UID,
    value: u64,
}

#[test]
fun test_dynamic_fields() {
    let mut test_scenario = test_scenario::begin(@0xCAFE);
    let mut container = Container {
        id: object::new(test_scenario.ctx()),
    };

    // PART 1: Dynamic Fields
    dynamic_field::add(&mut container.id, b"score", 100u64);
    let score = dynamic_field::borrow(&container.id, b"score");
    assert!(score == 100, 123);
    dynamic_field::remove<vector<u8>, u64>(&mut container.id, b"score");
    assert!(!dynamic_field::exists_(&container.id, b"score"), 124);

    // PART 2: Dynamic Object Fields
    let item = Item {
        id: object::new(test_scenario.ctx()),
        value: 500,
    };
    dynamic_object_field::add(&mut container.id, b"item", item);
    let item_ref = dynamic_object_field::borrow<vector<u8>, Item>(&container.id, b"item");
    assert!(item_ref.value == 500, 125);
    let item = dynamic_object_field::remove<vector<u8>, Item>(&mut container.id, b"item");
    assert!(!dynamic_object_field::exists_(&container.id, b"item"), 126);
    let Item { id, value: _ } = item;
    object::delete(id);

    // Clean up
    let Container {
        id,
    } = container;
    object::delete(id);
    test_scenario.end();
}
