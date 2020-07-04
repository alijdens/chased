"use strict";

/**
 * Creates a chaser robot.
 * 
 * @param pos Initial position in the map (row/col).
 * @param target_entity Entity to chase.
 */
function chaser_create(pos, target_entity) {
    var coords = map_get_tile_coords(pos.row, pos.col);

    // creates an entity
    var entity = entity_manager_create_entity();

    // attaches the components
    physics_component_add(entity, coords, 0, physics_create_circular_shape(3.5));
    robot_move_component_add(entity, false, 30, Math.PI, false);
    ai_straight_chase_component_add(entity, target_entity);
    sprite_component_add(entity, SPRITES.chaser, false);
    point_at_component_add(entity, target_entity, 0.5);
    entity_manager_add_component(entity, COMPONENT.PLAYER_KILLER_TAG, {});

    return entity;
}

/**
 * Creates a finder robot (uses path finding).
 * 
 * @param pos Initial position in the map (row/col).
 * @param target_entity Entity to chase.
 */
function finder_create(pos, target_entity) {
    var coords = map_get_tile_coords(pos.row, pos.col);

    // creates an entity
    var entity = entity_manager_create_entity();

    // attaches the components
    physics_component_add(entity, coords, 0, physics_create_square_shape(6));
    robot_move_component_add(entity, true, 12, Math.PI / 1.3, true);
    sprite_component_add(entity, SPRITES.red_eyed_robot, true);
    ai_path_finder_component_add(entity, target_entity);
    entity_manager_add_component(entity, COMPONENT.PLAYER_KILLER_TAG, {});

    return entity;
}
