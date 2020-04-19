"use strict";

/**
 * Detects if orb collector entities grabbed them.
 * 
 * @param dt Time elapsed since last call.
 */
function orb_collector_system_update(dt) {
    var collectors = entity_manager_get_with_component(COMPONENT.ORB_COLLECTOR_TAG);
    for( var entity in collectors ) {
        // checks if the orb collector has collided
        var collision = entity_manager_get_component(entity, COMPONENT.COLLISION);
        if( collision === undefined ) {
            continue;
        }

        // checks if the other entity is an orb
        var orb_data = entity_manager_get_component(collision.target_entity, COMPONENT.ORB_TAG);
        if( orb_data === undefined ) {
            return;
        }

        // destroys the orb
        entity_manager_destroy_entity(collision.target_entity);
    }
}
