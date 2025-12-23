#[test_only]
module scenario::acl_tests;

use sui::test_scenario;

use scenario::acl;

#[test]
fun test_add_admin() {
    let initial_admin = @0x11111;
    let new_admin = @0x22222;

    // Initialize package
    let mut scenario = test_scenario::begin(initial_admin);
    acl::init_for_testing(scenario.ctx());

    scenario.next_tx(initial_admin);

    // Task: Add admin `new_admin`
    {
        let mut admins = test_scenario::take_shared<acl::Admins>(&scenario);
        let admin_cap = test_scenario::take_from_sender<acl::AdminCap>(&scenario);
        
        acl::add_admin(
            &mut admins,
            &admin_cap,
            new_admin
        );
        
        test_scenario::return_shared(admins);
        test_scenario::return_to_sender(&scenario, admin_cap);
    };

    // Task: Authorize admin `new_admin`
    {
        scenario.next_tx(new_admin);
        let admins = test_scenario::take_shared<acl::Admins>(&scenario);
        
        acl::authorize(&admins, scenario.ctx());
        
        test_scenario::return_shared(admins);
    };

    scenario.end();
}
