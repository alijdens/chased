"use strict";

var accumulated_dt = 0;


function main_menu() {
    accumulated_dt = 0;

    entity_manager_init();
    system_manager_init();

    // registers the relevant systems
    system_manager_register(SYSTEM.SPRITES, sprite_update);

    // creates the entities
    var player = player_create(map.player_start_position, ROBOT_DIRECTION.UP);

    for( var i = 0; i < map.orbs.length; i++ ) {
        orb_create(map.orbs[i]);
    }
    for( var i = 0; i < map.chasers.length; i++ ) {
        chaser_create(map.chasers[i], player);
    }
    for( var i = 0; i < map.finders.length; i++ ) {
        finder_create(map.chasers[i], player);
    }

    // enables keyboard control
    set_game_controls();

    var start_time = Date.now();
    game_loop(renderer, start_time);
}

function main_menu_loop() {

}

function _draw_title(renderer) {
    var title_x = renderer.width() / 2;
    var title_y = renderer.height() / 4;
    var title_height = renderer.height() / 
}
