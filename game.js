"use strict";

// accumulation of elapsed time since last systems update.
var accumulated_dt = 0;

// used to accelerate or slow down the time simulation.
var _time_multiplier = 1;

// frames per second to simulate. Uses a constant framerate
// to guarantee deterministic physics simulation on every
// environment.
const frame_rate = 1 / 40;

// whether the game has finished
var _game_over = false;

// this variable is set when the game finished
var _player_won;

// whether the game must be reloaded.
var _reload = false;

// used to indicate the state when a key was pressed and we are waiting 
// for it to be released.
var _key_pressed = {};


/**
 * Main game loop.
 * 
 * @param renderer Renderer object.
 * @param start_time Time when the last frame started.
 */
var game_loop = function(renderer, start_time) {
    if( _reload ) {
        game_start(renderer, map_selector_get_current());
        return;
    }

    // calculates the elapsed time since the last call in seconds
    var current_time = Date.now();
    var dt = ((current_time - start_time) / 1000) * _time_multiplier;
    
    // updates the systems
    accumulated_dt += dt;
    while( accumulated_dt >= frame_rate ) {
        accumulated_dt -= frame_rate;
        system_manager_update(frame_rate);
    }

    renderer.clear('black');
    var viewport = game_get_map_viewport(renderer, map_get(), renderer.width(), renderer.height());
    map_draw(viewport, map_get());
    sprite_draw(viewport);

    if( _game_over ) {
        game_draw_end_screen(renderer);
    }

    while( !keyboard_queue_is_empty() ) {
        _process_game_keyboard_event( keyboard_queue_pull() );
    }

    _game_input_handle();
    
    requestAnimationFrame(function() {
        game_loop(renderer, current_time);
    });
};


/**
 * Starts a new game.
 * 
 * @param renderer Renderer object.
 * @param map Map to create the game with.
 * 
 * @note Assets must already been loaded using `sprites_load`.
 */
function game_start(renderer, map) {    
    // initialization
    _game_over = false;
    _reload = false;
    _player_won = false;
    accumulated_dt = 0;
    _key_pressed = {};

    map_set(map);

    entity_manager_init();
    system_manager_init();

    // registers the entities and systems
    system_manager_register(SYSTEM.ROBOT_MOVE, robot_move_system_update);
    system_manager_register(SYSTEM.POINT_AT, point_at_system_update);
    system_manager_register(SYSTEM.PHYSICS, physics_system_update);
    system_manager_register(SYSTEM.ORB_COLLECTOR, orb_collector_system_update);
    system_manager_register(SYSTEM.AI_STRAIGHT_CHASE, ai_straight_chase_system_update);
    system_manager_register(SYSTEM.AI_PATH_FINDER, ai_path_finder_system_update);
    system_manager_register(SYSTEM.GAME_CHECK, game_check_system);
    system_manager_register(SYSTEM.SPRITES, sprite_update);
    system_manager_register(SYSTEM.COLLISION, collision_system_update);

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
    keyboard_set_queue_events();
    keyboard_queue_set_empty();

    var start_time = Date.now();
    game_loop(renderer, start_time);
}

/**
 * Renders the screen that shows the game result.
 * 
 * @param renderer Renderer object.
 */
function game_draw_end_screen(renderer) {    
    var width = renderer.ctx.canvas.width;
    var height = renderer.ctx.canvas.height;

    // draws a transparent rectangle over the screen
    renderer.ctx.globalAlpha = 0.4;
    renderer.ctx.fillStyle = "gray";
    renderer.ctx.fillRect( 0, 0, width, height );
    renderer.ctx.globalAlpha = 1.0;

    var sprite;
    if( _player_won ) {
        sprite = SPRITES.game_won;
    } else {
        sprite = SPRITES.game_lost;
    }

    renderer.draw_screen(sprite, 1/2, 1/3, 1);
}

/**
 * Checks if the game finished and, if so, stops the main loop and
 * renders the result.
 * 
 * @param dt Time elapsed since last call.
 */
function game_check_system( dt ) {
    var orb_entities = entity_manager_get_with_component(COMPONENT.ORB_TAG);

    // if there are no orbs, then the player has won
    if( is_empty( orb_entities ) ) {
        game_over(true);
    }

    // checks for collisions
    var player = entity_manager_get_with_component(COMPONENT.HUMAN_CONTROL);

    for( var entity in player ) {
        var player_collision = entity_manager_get_component(entity, COMPONENT.COLLISION);
        if( player_collision === undefined ) {
            continue;
        }

        // checks if collided with an entity that kills the player
        var other = player_collision.target_entity;
        if( entity_manager_get_component(other, COMPONENT.PLAYER_KILLER_TAG) !== undefined ) {
            game_over(false);
        }
    }
}

/**
 * Triggers the game over event.
 * 
 * @param player_won Boolean indicating whether the player has won the game.
 */
function game_over( player_won ) {
    // removes all systems except the one that updates the animations
    system_manager_unregister_all();
    system_manager_register(SYSTEM.SPRITE, sprite_update);

    _game_over = true;
    _player_won = player_won;
    
    var entity = entity_manager_create_entity();
    sprite_component_add(entity, SPRITES.press_any_key_message, false, 100);
    sprite_add_draw_params(entity, 1/2, 2/3, 0.7, null, true);
    sprite_blink_component_add(entity, 0.8);

    setTimeout(set_end_game_controls, 1000);
}

/**
 * Forces the game to reload.
 */
function game_reload() {
    disable_game_controls();
    _reload = true;
}

/**
 * Checks if the player won the game.
 */
function game_won() {
    return _player_won;
}

function is_empty( obj ) {
    for( var key in obj ) {
        if( obj.hasOwnProperty( key ) ) {
            return false;
        }
    }
    return true;
}

/**
 * Creates and returns a viewport for the game map.
 * 
 * @param renderer Renderer.
 * @param map Map to create the viewport for.
 * @param width Viewport screen width.
 * @param height Viewport screen height.
 */
function game_get_map_viewport(renderer, map, width, height) {
    // calculates the scale that relates the game space to viewport space
    const tile_size = Math.min(width / map.width, height / map.height);

    // the amount of space that won't be used on each dimension of the screen
    const x_left_over = Math.max(0, width - tile_size * map.width);
    const y_left_over = Math.max(0, height - tile_size * map.height);

    return new Viewport(
        renderer,
        x_left_over / 2, y_left_over / 2,
        width - x_left_over, height - y_left_over,
        TILE_SIZE * map.width, TILE_SIZE * map.height);
}

/**
 * Processes a key event.
 * 
 * @param event Key event.
 */
function _process_game_keyboard_event(event) {
    // marks the key as pressed or released
    _key_pressed[event.key] = (event.action == 'down');

    // handles time speed
    if( event.action == 'down' && event.key == ' ' ) {
        if( _time_multiplier == 2 ) {
            _time_multiplier = 1;
        } else {
            _time_multiplier = 2;
        }
    }
}

/**
 * Handles the player controls.
 */
function _game_input_handle() {
    // gets the player entity
    var entities = entity_manager_get_with_component(COMPONENT.HUMAN_CONTROL);

    for( var entity in entities ) {
        var data = entity_manager_get_component(entity, COMPONENT.ROBOT_MOVE);

        if( _key_pressed['ArrowUp'] || _key_pressed['w'] ) {
            robot_move(entity, data, ROBOT_DIRECTION.UP);
        } else if( _key_pressed['ArrowRight'] || _key_pressed['d'] ) {
            robot_move(entity, data, ROBOT_DIRECTION.RIGHT);
        } else if( _key_pressed['ArrowDown'] || _key_pressed['s'] ) {
            robot_move(entity, data, ROBOT_DIRECTION.DOWN);
        } else if( _key_pressed['ArrowLeft'] || _key_pressed['a'] ) {
            robot_move(entity, data, ROBOT_DIRECTION.LEFT);
        }
    }
}
