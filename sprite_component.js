/**
 * Attaches a sprite to an entity.
 * 
 * @param entity Target entity.
 * @param sprite Sprint to attach.
 * @param stopped Valid for animations. If it starts playing ot not.
 * @param depth Higher depth components are drawn later.
 */
function sprite_component_add(entity, sprite, stopped, depth) {
    var data = {
        animated: 'frames' in sprite,
        stopped: stopped, // only valid for animations: whether the animation plays or not
        data: sprite,
        elapsed_since_last_frame: 0,  // time elapsed since last frame update
        current_frame: 0,
        depth: depth,
        off: false, // whether to draw this sprite or not
    }
    entity_manager_add_component(entity, COMPONENT.SPRITE, data);
}

/**
 * Makes a sprite blink.
 * 
 * @param entity Entity to attach this component.
 * @param period Blink period.
 */
function sprite_blink_component_add(entity, period) {
    var data = {period: period, elapsed_since_last_frame: 0,};
    entity_manager_add_component(entity, COMPONENT.SPRITE_BLINK, data);
}

/**
 * Adds draw information for sprites.
 * 
 * @param entity Entity to attach.
 * @param x Horizontal position in the screen (0-1).
 * @param y Vertical position in the screen (0-1).
 * @param width Width to use when drawing.
 * @param height Height to use when drawing (or `null` to keep aspect ratio).
 * @param draw_on_screen Whether to draw directly to the screen or on the viewport.
 */
function sprite_add_draw_params(entity, x, y, width, height, draw_on_screen) {
    var data = {
        x: x, y: y, width: width, height: height, draw_on_screen: draw_on_screen
    };
    entity_manager_add_component(entity, COMPONENT.DRAW_PARAMS, data);
}
