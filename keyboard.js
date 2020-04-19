"use strict";


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
    document.onkeydown = game_end_on_key_down;
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

/**
 * Game end keyboard event handler.
 * @param event Keyboard event.
 */
function game_end_on_key_down(event) {
    // any key updates the state
    if( game_won() ) {
        // sets the next map
        map_selector_set_next();
    }
    
    game_reload();
}
