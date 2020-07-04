"use strict";

const ROBOT_STATE = {
    IDLE: 'idle',
    MOVING: 'moving',
    ROTATING: 'rotating',
};

const ROBOT_DIRECTION = {
    RIGHT: 0,
    UP: Math.PI / 2,
    LEFT: Math.PI,
    DOWN: (Math.PI * 3) / 2,
}

/**
 * Adds a this component to the given entity.
 * @param entity Entity to attach the component to.
 * @param rotates Whether the robot needs to rotate and face the direction
 *                before being able to translate.
 * @param speed Scalar indicating the movement speed.
 * @param angular_speed Rotation speed.
 * @param control_animation Whether to stop the animation when idle.
 */
function robot_move_component_add(entity, rotates, speed, angular_speed, control_animation) {
    var data = {
        state: ROBOT_STATE.IDLE,
        tgt_pos: new Vector2(),
        tgt_angle: 0,
        move_duration: 0, // time in seconds that will take the robot to finish the current move
        rotates: rotates,
        speed: speed,
        angular_speed: angular_speed,
        control_animation: control_animation,
    };
    entity_manager_add_component(entity, COMPONENT.ROBOT_MOVE, data);
}

/**
 * Moves or rotates the robot if possible.
 * 
 * @param data robot_move component data.
 * @param direction Direction to move to (ROBOT_DIRECTION).
 */
function robot_move(entity, data, direction) {
    // gets the physics component
    var physics = entity_manager_get_component(entity, COMPONENT.PHYSICS);
    if( physics === undefined ) {
        throw new Error("robot_move requires a physics component");
    }

    // the robot can only be controlled if idle
    if( data.state != ROBOT_STATE.IDLE ) {
        return;
    }

    // checks if it needs to rotate first
    if( physics.angle != direction && data.rotates ) {
        _robot_rotate(physics, data, direction);
        return;
    }

    // moves the robot
    _robot_move( entity, physics, data, direction );
}

/**
 * Checks if a robot can move to the position in the map.
 * 
 * @param entity Entity that wants to move.
 * @param map Map.
 * @param pos Position in the map.
 */
function robot_can_move(entity, map, pos) {
    switch( map.tiles[pos.row][pos.col] ) {
        case MAP_TILE.EMPTY:
            return true;
        case MAP_TILE.WALL:
            // cannot move to wall tiles
            return false;
        default:
            throw new Error( "Unexpected tile type " + map.tiles[next.row][next.col] );
    }
}

/**
 * Rotates the robot in the given direction.
 * 
 * @param physics physics component data.
 * @param data robot_move component data.
 * @param direction Direction to move to.
 */
function _robot_rotate(physics, data, direction) {
    var distance = direction - physics.angle;

    var angular_speed = data.angular_speed;
    if( distance < 0 ) {
        angular_speed *= -1;
    }
    
    if( Math.abs( distance ) > Math.PI ) {
        // it's faster to rotate in the other direction
        angular_speed *= -1;
        distance %= Math.PI;
    }

    var time = Math.abs(distance / angular_speed);
    
    data.state = ROBOT_STATE.ROTATING;
    data.tgt_angle = direction;
    data.move_duration = time;

    physics.angular_speed = angular_speed;
}

/**
 * Moves the robot in the given direction if the move is valid.
 * 
 * @param entity The target entity.
 * @param physics physics component data.
 * @param data robot_move component data.
 * @param direction Direction to move to.
 */
function _robot_move(entity, physics, data, direction) {
    var map = map_get();
    
    var tgt_pos = map_get_tile_at(map, physics.pos.x, physics.pos.y);
    var speed = undefined;
    var scalar_speed = data.speed;
    switch( direction ) {
        case ROBOT_DIRECTION.RIGHT:
            tgt_pos.col += 1;
            speed = new Vector2(scalar_speed, 0);
            break;
        case ROBOT_DIRECTION.LEFT:
            tgt_pos.col -= 1;
            speed = new Vector2(-scalar_speed, 0);
            break;
        case ROBOT_DIRECTION.UP:
            tgt_pos.row -= 1;
            speed = new Vector2(0, -scalar_speed);
            break;
        case ROBOT_DIRECTION.DOWN:
            tgt_pos.row += 1;
            speed = new Vector2(0, scalar_speed);
            break;
        default:
            throw new Error( "Invalid direction " + direction );
    }

    // checks if the target tile is available
    if( !robot_can_move(entity, map, tgt_pos) ) {
        return;
    }
    
    // sets the target coordinates
    data.tgt_pos = map_get_tile_coords(tgt_pos.row, tgt_pos.col);

    const distance = new Vector2();
    distance.subVectors(data.tgt_pos, physics.pos);

    const time = distance.length() / scalar_speed;

    data.state = ROBOT_STATE.MOVING;
    data.move_duration = time;

    physics.speed = distance.normalize().multiplyScalar(scalar_speed);

    var sprite = entity_manager_get_component(entity, COMPONENT.SPRITE);
    if( sprite !== undefined && data.control_animation ) {
        sprite.stopped = false;
    }
}
