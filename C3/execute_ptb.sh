#!/bin/bash

birth_date="01-09-1986"
birth_date_timestamp=$(date -d "01-09-1986" +%s000)
name="nikos"

PACKAGE_ID="0xe9d24d6a29ea914fe9ca52f9eb2b7f9933b51aae0b7ed30fd5ed63fd4cda57e1"
WEATHER_PACKAGE_ID="0x899e0aec11b8cce7b7e7a0b9b1b26c1492536288a931d96096b342851af6f955"
NAME_PACKAGE_INDEXER_ID="0x67aa833c0b6a618c25147e2e5bf80002cee613eccfe4ad760e0e78552d221c0d"
AGE_CALCULATOR_PACKAGE_ID="0x37b3b7dd4d56d96b56f674cd634ad79f30ba12985617684919bbe5b5a0600bcc"
NAME_INDEXER_ID="0xa5e3bb306a9aa97db063027e6cfaa3ef037137b5387f3630d3fd6acd244fcd97"
STD_PACKAGE_ID="0x1"
CLOCK_ID="0x6"

sui client ptb \
    --move-call $AGE_CALCULATOR_PACKAGE_ID::age_calculator::calculate_age $CLOCK_ID $birth_date_timestamp \
    --assign age \
    --move-call $NAME_PACKAGE_INDEXER_ID::index_name::borrow_name $NAME_INDEXER_ID $name \
    --assign real_name \
    --move-call $PACKAGE_ID::my_event_emitter::emit_greeting_event \
        $CLOCK_ID \
        $NAME_INDEXER_ID \
        real_name \
        age \
