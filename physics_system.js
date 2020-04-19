"use strict";

// constant to avoid radians from increasing over an entire circumference.
const MAX_ANGLE = Math.PI * 2;


/**
 * System's update callback.
 * 
 * @param dt Time elapsed sine last call.
 */
function physics_system_update(dt) {
    // gets all the entities with physics components
    var entities = entity_manager_get_with_component(COMPONENT.PHYSICS);
    for( var entity1 in entities ) {
        var data = entities[entity1];

        // updates the position and rotation based on speed and elapsed time
        data.pos.addScaledVector(data.speed, frame_rate);
        data.angle = (data.angle + data.angular_speed * frame_rate) % MAX_ANGLE;
    
        // tests collisions
        for( var entity2 in entities ) {
            if( entity1 != entity2 ) {
                if( physics_test_collision( entities[entity1], entities[entity2] ) ) {
                    if( !entity_manager_has_component( entity1, COMPONENT.COLLISION ) ) {
                        collision_component_add( entity1, entity2 );
                    }

                    resolve_collision( entity1, entity2 );
                }
            }
        }
    }
}

/**
 * Resolves a collision by moving the entities away from each other.
 * 
 * @param entity1 Entity that moved.
 * @param entity2 Entity that `entity1` collided with.
 */
function resolve_collision( entity1, entity2 ) {
    
}
