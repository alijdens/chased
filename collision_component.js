"use strict";

/**
 * Adds a collision component to an entity.
 * 
 * @param entity Entity to add the component to.
 * @param other_entity The entity with whom it collided.
 */
function collision_component_add(entity, other_entity) {
    entity_manager_add_component(entity, COMPONENT.COLLISION, {target_entity: other_entity});
}
