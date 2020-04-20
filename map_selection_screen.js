"use strict";


// position of the map selection cursor.
var _cursor_map_index = 0;

// `true` if a map was selected by the user.
var _map_selected = false;

// size of the preview window
const PREVIEW_SIZE = 200;

// minimum margin allowed so separate the previews
const MIN_MARGIN = 30;


/**
 * Starts rendering the map selection screen.
 * 
 * @param renderer Renderer.
 */
function map_selection_screen(renderer) {
    _cursor_map_index = 0;

    entity_manager_init();
    system_manager_init();

    // registers the relevant systems
    system_manager_register(SYSTEM.SPRITES, sprite_update);

    // enables keyboard control
    set_map_selection_controls();
    keyboard_queue_set_empty();

    _map_selection_loop(renderer);
}

/**
 * Loop that updates the screen.
 * 
 * @param renderer Renderer.
 * @param start_time Last time this function was called.
 */
function _map_selection_loop(renderer) {
    if( _map_selected ) {
        map_selector_set(_cursor_map_index);
        game_start(renderer, map_selector_get_current());
        return;
    }

    while( !keyboard_queue_is_empty() ) {
        var key = keyboard_queue_pull();
        _process_keyboard_event(key, renderer);
    }
    _normalize_cursor_index();

    // rendering
    renderer.clear('black');
    _render_maps_preview_page(renderer, _cursor_map_index);
    _draw_cursor(renderer);
    
    requestAnimationFrame(function() {
        _map_selection_loop(renderer);
    });
}

/**
 * Shows a paged list of maps.
 * 
 * @param renderer Renderer.
 * @param map_index Index of the map the cursor is pointing to.
 */
function _render_maps_preview_page(renderer, map_index) {
    const dims = _get_gallery_dimensions(renderer);
    const maps_per_row = dims.cols;
    const num_rows = dims.rows;
    const maps_per_page = maps_per_row * num_rows;
    const page_num = Math.floor(map_index / maps_per_page);
    
    for( var i = 0; i < num_rows; i++ ) {
        for( var j = 0; j < maps_per_row; j++ ) {
            var index = maps_per_page * page_num + maps_per_row * i + j;
            if( index >= MAPS.length ) {
                break;
            }
    
            const map = map_parse(MAPS[index]);
            var viewport = game_get_map_viewport(renderer, map, PREVIEW_SIZE, PREVIEW_SIZE);
            var coordinates = _get_preview_coordinates(renderer, i, j);

            // adjusts the viewport's coordinates so the preview is centered
            viewport.x = coordinates.x + (PREVIEW_SIZE - viewport.width())/2;
            viewport.y = coordinates.y + (PREVIEW_SIZE - viewport.height())/2;

            map_draw(viewport, map);
        }
    }
}

/**
 * Draws the map selection cursor.
 */
function _draw_cursor(renderer) {
    var cursor_pos = _get_cursor_position(renderer);
    var coords = _get_preview_coordinates(renderer, cursor_pos.row, cursor_pos.col);

    const line_width = renderer.ctx.lineWidth;
    renderer.ctx.lineWidth = 10;
    renderer.ctx.strokeStyle = 'blue';
    renderer.ctx.strokeRect(coords.x, coords.y, PREVIEW_SIZE, PREVIEW_SIZE);
    renderer.ctx.lineWidth = line_width;
}

/**
 * Returns the screen coordinates of the preview at a given position.
 * 
 * @param renderer Renderer.
 * @param row Preview row.
 * @param col Preview column.
 */
function _get_preview_coordinates(renderer, row, col) {
    var margin = _get_margin_size(renderer);

    // upper left coordinates
    var x = col * (PREVIEW_SIZE + margin.x) + margin.x;
    var y = row * (PREVIEW_SIZE + margin.y) + margin.y;
    return {x: x, y: y};
}

/**
 * Returns the value of the previews margins on X and Y coordinates.
 * @param {*} renderer 
 */
function _get_margin_size(renderer) {
    const dims = _get_gallery_dimensions(renderer);

    // recalculates the margins so the are all equal
    const x_margin = (renderer.width() - dims.cols * PREVIEW_SIZE) / (dims.cols+1);
    const y_margin = (renderer.height() - dims.rows * PREVIEW_SIZE) / (dims.rows+1);
    return {x: x_margin, y: y_margin};
}

/**
 * Action of selecting a map to play.
 */
function map_selection_screen_start_game() {
    _map_selected = true;
}

/**
 * Processes a keyboard event in the queue.
 * 
 * @param key Key code.
 * @param renderer Renderer.
 */
function _process_keyboard_event(key, renderer) {
    const dims = _get_gallery_dimensions(renderer);
    switch( key ) {
        case 'ArrowUp':
            _cursor_map_index -= dims.cols;
            break;
        case 'ArrowDown':
            _cursor_map_index += dims.cols;
            break;
        case 'ArrowLeft':
            _cursor_map_index -= 1;
            break;
        case 'ArrowRight':
            _cursor_map_index += 1;
            break;
        case 'Enter':
            map_selection_screen_start_game();
            break;
    }
}

/**
 * Transforms the map index to row/col in the current page.
 * 
 * @param renderer Renderer.
 */
function _get_cursor_position(renderer) {
    const dims = _get_gallery_dimensions(renderer);
    
    const maps_per_page = dims.rows * dims.cols;
    const page_index = _cursor_map_index % maps_per_page;
    const row = Math.floor(page_index / dims.cols);
    const col = page_index % dims.cols;

    return {row: row, col: col};
}

/**
 * Gets the dimensions (in previews row/cols) of the gallery.
 * @param renderer Renderer.
 */
function _get_gallery_dimensions(renderer) {
    const maps_per_row = Math.floor((renderer.width() - MIN_MARGIN) / (PREVIEW_SIZE + MIN_MARGIN));
    const num_rows = Math.floor((renderer.height() - MIN_MARGIN) / (PREVIEW_SIZE + MIN_MARGIN));

    return {cols: maps_per_row, rows: num_rows};
}

/**
 * Handles wrap around of map indexes.
 */
function _normalize_cursor_index() {
    _cursor_map_index = _cursor_map_index % MAPS.length;
    if( _cursor_map_index < 0 ) {
        _cursor_map_index = MAPS.length - 1;
    }
}
