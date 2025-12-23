#[test_only]
module scenario::xp_tome_tests;

use sui::test_scenario;

use scenario::acl;
use scenario::xp_tome;

#[test]
fun test_new_xp_tome() {
    let admin = @0x11111;
    let hero_owner = @0x22222;
    let health = 20;
    let stamina = 5;

    // Initialize package
    let mut scenario = test_scenario::begin(admin);
    acl::init_for_testing(scenario.ctx());
    scenario.next_tx(admin);

    // Task: Create new `XPTome`
    {
        let admins = scenario.take_shared<acl::Admins>();
        xp_tome::new(
            &admins, 
            health, 
            stamina, 
            hero_owner,
            scenario.ctx()
        );
        test_scenario::return_shared(admins);
    };

    scenario.next_tx(hero_owner);

    // Task: Check `XPTome`'s field values
    {
        let xp_tome = test_scenario::take_from_address<xp_tome::XPTome>(&scenario, hero_owner);
        assert!(xp_tome.health() == health);
        assert!(xp_tome.stamina() == stamina);
        test_scenario::return_to_address(hero_owner, xp_tome);
    };

    scenario.end();
}

