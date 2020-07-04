"use strict";

/**
 * Adds a collision component to an entity.
 * 
 * @param entity Entity to add the component to.
 * @param other_entity The entity with whom it collided.
 * @param is_causal Whether `entity` was the one that caused the collision.
 */
function collision_component_add(entity, other_entity, is_causal) {
    let data = entity_manager_get_component(entity, COMPONENT.COLLISION);

    if( data === undefined ) {
        data = [];
    }

    data.push({target_entity: other_entity, is_causal: is_causal});
    entity_manager_update_component(entity, COMPONENT.COLLISION, data);
}
