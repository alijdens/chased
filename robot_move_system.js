"use strict";

/**
 * System's update callback.
 * 
 * @param dt Time elapsed sine last call.
 */
function robot_move_system_update(dt) {
    var entities = entity_manager_get_with_component(COMPONENT.ROBOT_MOVE);

    for( var entity in entities ) {
        var data = entities[entity];

        var physics = entity_manager_get_component(entity, COMPONENT.PHYSICS);
        if( physics === undefined ) {
            throw new Error("robot_move requires a physics component");
        }

        switch( data.state ) {
            case ROBOT_STATE.IDLE:
                break;
            case ROBOT_STATE.MOVING:
                _check_translation(entity, physics, data, dt);
                break;
            case ROBOT_STATE.ROTATING:
                _check_rotation(physics, data, dt);
                break;
            default:
                throw new Error('Unexpected state ' + entity.state);
        }
    }
}

/**
 * Updates the rotation angle of the entity.
 *
 * @param physics Physics component.
 * @param data Component data.
 * @param dt Time elapsed since last call.
 */
function _check_rotation(physics, data, dt) {
    data.move_duration -= dt;
    if( data.move_duration <= 0 ) {
        // the movement finished
        physics.angle = data.tgt_angle;
        physics.angular_speed = 0;
        data.state = ROBOT_STATE.IDLE;
    }
}

/**
 * Updates the position of the entity.
 *
 * @param entity Target entity.
 * @param physics Physics component.
 * @param data Component data.
 * @param dt Time elapsed since last call.
 */
function _check_translation(entity, physics, data, dt) {
    data.move_duration -= dt;
    if( data.move_duration <= 0 ) {
        // the movement finished
        physics.pos.copy(data.tgt_pos);
        physics.speed.set(0, 0);
        data.state = ROBOT_STATE.IDLE;

        // if it has an animation, stops it
        var sprite = entity_manager_get_component(entity, COMPONENT.SPRITE);
        if( sprite !== undefined && data.control_animation ) {
            sprite.stopped = true;
        }
    }
}
