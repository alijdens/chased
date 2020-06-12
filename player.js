"use strict";

/**
 * Creates a player entity.
 * 
 * @param pos Initial position (row and column).
 * @param angle Initial facing angle.
 */
function player_create(pos, angle) {
    var coords = map_get_tile_coords(pos.row, pos.col);

    // creates an entity
    var entity = entity_manager_create_entity();

    // attaches the components
    physics_component_add(entity, coords, angle, physics_create_square_shape(6));
    robot_move_component_add(entity, true, 15, Math.PI / 1.3, true);
    entity_manager_add_component(entity, COMPONENT.ORB_COLLECTOR_TAG, {});
    entity_manager_add_component(entity, COMPONENT.GHOST_TAG, {});
    sprite_component_add(entity, SPRITES.robot, true);
    human_control_component_add(entity);

    return entity;
}
