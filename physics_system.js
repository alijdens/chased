"use strict";

// constant to avoid radians from increasing over an entire circumference.
const MAX_ANGLE = Math.PI * 2;

const RIGHT = new Vector2(1, 0);
const UP = new Vector2(0, -1);

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
    
        // tests collisions against other entities
        for( var entity2 in entities ) {
            if( entity1 != entity2 ) {
                const contact = physics_test_collision( entities[entity1], entities[entity2] );
                if( contact != false ) {
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
    var body1 = entity_manager_get_component(entity1, COMPONENT.PHYSICS);
    var body2 = entity_manager_get_component(entity2, COMPONENT.PHYSICS);

    // only moves an object if it has speed
    if( body1.speed.length() == 0 ) {
        return;
    }

    // ignore ghost entities
    if (entity_manager_get_component(entity2, COMPONENT.GHOST_TAG)) {
        return;
    }

    const bb1 = physics_get_body_bb(body1);
    const bb2 = physics_get_body_bb(body2);

    let bounce_direction = undefined;
    if( body1.speed.dot(RIGHT) > 0 ) {
        body1.pos.x -= bb1.max.x - bb2.min.x;
        bounce_direction = ROBOT_DIRECTION.LEFT;
    } else if( body1.speed.dot(RIGHT) < 0 ) {
        body1.pos.x += bb2.max.x - bb1.min.x;
        bounce_direction = ROBOT_DIRECTION.RIGHT;
    } else if( body1.speed.dot(UP) > 0 ) {
        body1.pos.y += bb2.max.y - bb1.min.y;
        bounce_direction = ROBOT_DIRECTION.DOWN;
    } else if( body1.speed.dot(UP) < 0 ) {
        body1.pos.y -= bb1.max.y - bb2.min.y;
        bounce_direction = ROBOT_DIRECTION.UP;
    }

    // TODO: this should be in robot_move_system
    const rm1 = entity_manager_get_component(entity1, COMPONENT.ROBOT_MOVE);
    if( rm1 !== undefined ) {
        rm1.state = ROBOT_STATE.IDLE;
        robot_move( entity1, rm1, bounce_direction );
    }
}
