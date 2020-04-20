"use strict";


// keyboard events queue
var _queue = [];


/**
 * Removes user actions.
 */
function disable_game_controls() {
    document.onkeydown = null;
}

/**
 * Sets the appropriate in-game controls.
 */
function set_game_controls() {
    document.onkeydown = game_on_key_down;
}

/**
 * Sets the appropriate end game controls.
 */
function set_end_game_controls() {
    document.onkeydown = function (event) {
        // any key updates the state
        if( game_won() ) {
            // sets the next map
            map_selector_set_next();
        }

        game_reload();
    };
}

/**
 * Sets the main menu controls.
 */
function set_main_menu_controls() {
    document.onkeydown = function(event) {
        switch( event.key ) {
            case 'ArrowUp':
                main_menu_move_cursor_up();
                break;
            case 'ArrowDown':
                main_menu_move_cursor_down();
                break;
            case 'Enter':
                main_menu_apply();
                break;
        }
    };
}

/**
 * Sets the map selection screen controls.
 */
function set_map_selection_controls() {
    document.onkeydown = function(event) {
        keyboard_queue_push(event.key);
        //switch( event.key ) {
        //    case 'ArrowUp':
        //        map_selection_screen_move_cursor_up();
        //        break;
        //    case 'ArrowDown':
        //        map_selection_screen_move_cursor_down();
        //        break;
        //    case 'ArrowLeft':
        //        map_selection_screen_move_cursor_left();
        //        break;
        //    case 'ArrowRight':
        //        map_selection_screen_move_cursor_right();
        //        break;
        //    case 'Enter':
        //        map_selection_screen_start_game();
        //        break;
        //}
    };
}

/**
 * Game keyboard event handler.
 * @param event Keyboard event.
 */
function game_on_key_down(event) {
    // gets the player entity
    var entities = entity_manager_get_with_component(COMPONENT.HUMAN_CONTROL);

    for( var entity in entities ) {
        var data = entity_manager_get_component(entity, COMPONENT.ROBOT_MOVE);

        switch( event.key ) {
            case 'ArrowUp':
                robot_move(entity, data, ROBOT_DIRECTION.UP);
                break;
            case 'ArrowDown':
                robot_move(entity, data, ROBOT_DIRECTION.DOWN);
                break;
            case 'ArrowRight':
                robot_move(entity, data, ROBOT_DIRECTION.RIGHT);
                break;
            case 'ArrowLeft':
                robot_move(entity, data, ROBOT_DIRECTION.LEFT);
                break;
            default:
                return;
        }
    }
}

function keyboard_queue_push(event) {
    _queue.push(event);
}

function keyboard_queue_pull() {
    return _queue.shift();
}

function keyboard_queue_is_empty() {
    return (_queue.length == 0);
}

function keyboard_queue_set_empty() {
    return _queue = [];
}
