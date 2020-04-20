"use strict";

var _accumulated_dt = 0;
var _cursor_position = 0;
var _entry_selected = false;

// Options to list in the main menu.
var MENU_ENTRIES;


/**
 * Beings the rendering of the main menu screen.
 * 
 * @param renderer Renderer.
 */
function main_menu(renderer) {
    _cursor_position = 0;
    _accumulated_dt = 0;
    _entry_selected = false;

    MENU_ENTRIES = [
        { action: _play_first_map_not_won, sprite: SPRITES.main_menu_start_game },
        { action: _go_to_map_selection, sprite: SPRITES.main_menu_select_map },
    ]

    entity_manager_init();
    system_manager_init();

    // registers the relevant systems
    system_manager_register(SYSTEM.SPRITES, sprite_update);

    // enables keyboard control
    set_main_menu_controls();

    // adds the menu entries
    _main_menu_initialize();

    var start_time = Date.now();
    _main_menu_loop(renderer, start_time);
}

/**
 * Loop that updates the main menu.
 * 
 * @param renderer Renderer.
 * @param start_time Last time this function was called.
 */
function _main_menu_loop(renderer, start_time) {
    if( _entry_selected ) {
        MENU_ENTRIES[_cursor_position].action(renderer);
        return;
    }

    // calculates the elapsed time since the last call in seconds
    var current_time = Date.now();
    var dt = (current_time - start_time) / 1000;

    // updates the systems
    _accumulated_dt += dt;
    while( _accumulated_dt >= frame_rate ) {
        _accumulated_dt -= frame_rate;
        system_manager_update(frame_rate);
    }

    renderer.clear('black');
    var viewport = _get_main_menu_viewport(renderer);
    sprite_draw(viewport);
    
    requestAnimationFrame(function() {
        _main_menu_loop(renderer, current_time);
    });
}

/**
 * Moves the cursor to the entry below.
 */
function main_menu_move_cursor_down() {
    _cursor_position = (_cursor_position + 1) % MENU_ENTRIES.length;
    _point_cursor_at_entry(_cursor_position);
}

/**
 * Moves the cursor to the upper entry.
 */
function main_menu_move_cursor_up() {
    _cursor_position -= 1;
    if( _cursor_position < 0 ) {
        _cursor_position = MENU_ENTRIES.length - 1;
    }
    _point_cursor_at_entry(_cursor_position);
}

/**
 * Applies the action of the selected cursor.
 */
function main_menu_apply() {
    _entry_selected = true;
}

/**
 * Sets up the entities on the main menu.
 */
function _main_menu_initialize() {
    var title = entity_manager_create_entity();
    sprite_component_add(title, SPRITES.main_menu_title, false, 1);

    // title will be 80% of the screen width
    sprite_add_draw_params(title, 1/2, 1/4, 0.9, null, false);

    // menu entries are drawn in the lower half of the screen
    var entries_area = 0.8 / 2;

    // adds the menu entries
    var entry_height =  _get_menu_entry_height();
    for( var i = 0; i < MENU_ENTRIES.length; i++ ) {
        const entry = MENU_ENTRIES[i];

        var entity = entity_manager_create_entity();
        sprite_component_add(entity, entry.sprite, false, 1);
        sprite_add_draw_params(
            entity,
            1/2, _get_menu_entry_pos(i),
            null, entry_height * 0.7,
            false);
    }

    // adds the menu cursor pointing at the first menu entry
    var cursor = entity_manager_create_entity();
    sprite_component_add(cursor, SPRITES.main_menu_cursor, false, 1);
    sprite_add_draw_params( cursor, 0, 0, null, entry_height * 0.7, false);
    entity_manager_add_component(cursor, COMPONENT.MENU_CURSOR_TAG, {});
    _point_cursor_at_entry(0);
}

/**
 * Creates the viewport that will be used to render the main menu screen.
 * It maps the virtual coordinates 0-1 to a centered square region in the screen.
 * 
 * @param renderer Renderer.
 */
function _get_main_menu_viewport(renderer) {
    const width = renderer.width();
    const height = renderer.height();
        
    // the amount of space that won't be used on each dimension of the screen
    var size = Math.min(width, height);
    const x_left_over = Math.max(0, width - size);
    const y_left_over = Math.max(0, height - size);

    // creates a viewport for a square draw area
    return new Viewport(renderer, x_left_over/2, y_left_over/2, size, size, 1, 1);
}

/**
 * Moves to the map selection screen.
 * 
 * @param renderer Renderer.
 */
function _go_to_map_selection(renderer) {
    map_selection_screen(renderer);
}

/**
 * Plays the first map that the player hasn't won yet.
 * 
 * @param renderer Renderer.
 */
function _play_first_map_not_won(renderer) {
    // TODO: persist the maps that the user beated
    game_start(renderer, map_selector_get_current());
}

/**
 * Returns the Y coordinate of a menu entry.
 * 
 * @param entry_num Index of the menu entry.
 */
function _get_menu_entry_pos(entry_num) {
    var entry_height = _get_menu_entry_height();
    var entry_y_offset = 0.5 * 1.1;
    return entry_y_offset + entry_height * entry_num;
}

/**
 * Returns the height of the menu entries.
 */
function _get_menu_entry_height() {
    // menu entries are drawn in the lower half of the screen
    const entries_area = 0.8 / 2;
    return Math.min(1/20, entries_area / MENU_ENTRIES.length);
}

/**
 * Returns the width of a menu entry.
 * 
 * @param entry_num Index of the menu entry.
 */
function _get_menu_entry_width(entry_num) {
    var entry_height = _get_menu_entry_height();
    var clip = MENU_ENTRIES[entry_num].sprite.clip;
    return (entry_height / clip.height) * clip.width;
}

/**
 * Moves the pointer to the menu entry at the given index.
 * 
 * @param entry_num Number of the menu entry to point to.
 */
function _point_cursor_at_entry(entry_num) {
    var entities = entity_manager_get_with_component(COMPONENT.MENU_CURSOR_TAG);
    for( var entity in entities ) {
        var draw_params = entity_manager_get_component(entity, COMPONENT.DRAW_PARAMS);
        draw_params.x = 0.5 + _get_menu_entry_width(entry_num) / 2;
        draw_params.y = _get_menu_entry_pos(entry_num);
    }
}
