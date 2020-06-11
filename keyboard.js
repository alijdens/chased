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
            case 'w':
                main_menu_move_cursor_up();
                break;
            case 'ArrowDown':
            case 's':
                main_menu_move_cursor_down();
                break;
            case 'Enter':
                main_menu_apply();
                break;
        }
    };
}

/**
 * Pushes keyboard events to the queue.
 */
function keyboard_set_queue_events() {
    document.onkeydown = function(event) {
        keyboard_queue_push({key: event.key, action: 'down'});
    };
    document.onkeyup = function(event) {
        keyboard_queue_push({key: event.key, action: 'up'});
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
