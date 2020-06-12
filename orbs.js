"use strict";

const ORB_RADIUS = 1.5;

/**
 * Creates an orb entity.
 * 
 * @param position Position (row and col) where the orb is located.
 */
function orb_create(position) {
    var entity = entity_manager_create_entity();
    var coords = map_get_tile_coords(position.row, position.col);
    physics_component_add(entity, coords, 0, physics_create_circular_shape(ORB_RADIUS));
    sprite_component_add(entity, SPRITES.orb, false);
    entity_manager_add_component(entity, COMPONENT.ORB_TAG, {});
    entity_manager_add_component(entity, COMPONENT.GHOST_TAG, {});
}
