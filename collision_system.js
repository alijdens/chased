"use strict";

/**
 * Handles collisions between objects.
 * 
 * @param dt Time elapsed since last call.
 */
function collision_system_update(dt) {
    var entities = entity_manager_get_with_component(COMPONENT.COLLISION);
    for( var entity in entities ) {
        // clean up the event
        entity_manager_remove_component(entity, COMPONENT.COLLISION);
    }
}
