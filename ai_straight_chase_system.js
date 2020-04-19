"use strict";


/**
 * Updates entities to chase a target in a straight line.
 * 
 * @param dt Time elapsed since last call. 
 */
function ai_straight_chase_system_update( dt ) {
    var entities = entity_manager_get_with_component( COMPONENT.AI_STRAIGHT_CHASE );

    for( var entity in entities ) {
        var data = entity_manager_get_component( entity, COMPONENT.AI_STRAIGHT_CHASE );
        var move = entity_manager_get_component( entity, COMPONENT.ROBOT_MOVE );
        if( move === undefined ) {
            throw new Error( "AIs must have move components" );
        }

        if( move.state != ROBOT_STATE.IDLE ) {
            continue;
        }
        
        var target_physics = entity_manager_get_component( data.target_entity, COMPONENT.PHYSICS );
        if( target_physics === undefined ) {
            throw new Error( "Targets must have physics in order to be followed" );
        }
        
        var physics = entity_manager_get_component( entity, COMPONENT.PHYSICS );
        const map = map_get();
        const pos = map_get_tile_at( map, physics.pos.x, physics.pos.y );
        const tgt_pos = map_get_tile_at( map, target_physics.pos.x, target_physics.pos.y );

        const d_x = tgt_pos.col - pos.col;
        const d_y = tgt_pos.row - pos.row;

        // moves in the shortest available dimension
        var direction = undefined;
        if( d_x > 0 ) {
            if( map.tiles[pos.row][pos.col+1] == MAP_TILE.EMPTY ) {
                direction = ROBOT_DIRECTION.RIGHT;
            }
        } else if( d_x < 0 ) {
            if( map.tiles[pos.row][pos.col-1] == MAP_TILE.EMPTY ) {
                direction = ROBOT_DIRECTION.LEFT;
            }
        }

        if( direction === undefined ) {
            if( d_y > 0 ) {
                if( map.tiles[pos.row+1][pos.col] == MAP_TILE.EMPTY ) {
                    direction = ROBOT_DIRECTION.DOWN;
                }
            } else if( d_y < 0 ) {
                if( map.tiles[pos.row-1][pos.col] == MAP_TILE.EMPTY ) {
                    direction = ROBOT_DIRECTION.UP;
                }
            }
        }

        // calculates the move direction
        if( direction !== undefined ) {
            robot_move( entity, move, direction );
        }
    }
}

/**
 * Adds the AI to the given entity.
 * 
 * @param entity Entity to add behavior to.
 * @param target_entity Entity to chase.
 */
function ai_straight_chase_component_add( entity, target_entity ) {
    var data = {
        target_entity: target_entity,
    };
    entity_manager_add_component( entity, COMPONENT.AI_STRAIGHT_CHASE, data );
}
