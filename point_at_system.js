"use strict";


/**
 * Transforms a physical body to rotate and point at a target.
 * 
 * @param dt Time elapsed since last call.
 */
function point_at_system_update(dt) {
    var entities = entity_manager_get_with_component( COMPONENT.POINT_AT );
    for( var entity in entities ) {
        var data = entity_manager_get_component( entity, COMPONENT.POINT_AT );
        var physics = entity_manager_get_component( entity, COMPONENT.PHYSICS );
        var target_physics = entity_manager_get_component( data.target_entity, COMPONENT.PHYSICS );
        if( target_physics === undefined ) {
            throw new Error( "Target entity must have physics component" );
        }

        var direction = new Vector2();
        direction.subVectors( target_physics.pos, physics.pos )
        physics.angle = -direction.angle();
    }
}

/**
 * Adds the component to the entity.
 *
 * @param entity Entity to add the component to.
 * @param target_entity Entity to look at.
 * @param angular_velocity Velocity for the rotation.
 */
function point_at_component_add( entity, target_entity, angular_velocity ) {
    var data = {
        target_entity: target_entity,
        velocity: angular_velocity,
    };
    entity_manager_add_component( entity, COMPONENT.POINT_AT, data );
}
