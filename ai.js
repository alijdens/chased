"use strict";


function ai_path_finder_component_add(entity, target_entity) {
    var data = {
        target_entity: target_entity,
    };
    entity_manager_add_component( entity, COMPONENT.AI_PATH_FINDER, data );
}

function ai_path_finder_system_update(dt) {
    var entities = entity_manager_get_with_component( COMPONENT.AI_PATH_FINDER );

    for( var entity in entities ) {
        var data = entity_manager_get_component( entity, COMPONENT.AI_PATH_FINDER );
        var move = entity_manager_get_component( entity, COMPONENT.ROBOT_MOVE );
        var physics = entity_manager_get_component( entity, COMPONENT.PHYSICS );
        if( move === undefined ) {
            throw new Error( "AI needs robot move component" );
        }

        if( move.state != ROBOT_STATE.IDLE ) {
            continue;
        }

        var target_physics = entity_manager_get_component( data.target_entity, COMPONENT.PHYSICS );
        if( target_physics === undefined ) {
            throw new Error( "AI target needs a position" );
        }

        var map = map_get();
        var start = map_get_tile_at(map, physics.pos.x, physics.pos.y);
        var end = map_get_tile_at(map, target_physics.pos.x, target_physics.pos.y);

        var next = a_star_path_finder(pos => robot_can_move(entity, map, pos), start, end);
        var d_y = next.row - start.row;
        var d_x = next.col - start.col;
        if( d_x > 0 ) {
            robot_move( entity, move, ROBOT_DIRECTION.RIGHT );
        } else if( d_x < 0 ) {
            robot_move( entity, move, ROBOT_DIRECTION.LEFT );
        } else if( d_y > 0 ) {
            robot_move( entity, move, ROBOT_DIRECTION.DOWN );
        } else if( d_y < 0 ) {
            robot_move( entity, move, ROBOT_DIRECTION.UP );
        }
    }
}

function a_star_path_finder(can_move, start, target) {
    var g = new Dict(to_string);
    var open = new Heap(to_string);
    var closed = new Set();
    var parents = new Dict(to_string);
    var end = null;

    g.set(start, 0);
    open.push(start, 0);
    parents.set(start, null);
    while( !open.is_empty() ) {
        var current = open.pop();
        if( (current.row == target.row) && (current.col == target.col) ) {
            end = current;
            break;
        }

        closed.add(to_string(current));

        var next_list = [
            {row: current.row + 1, col: current.col},
            {row: current.row - 1, col: current.col},
            {row: current.row, col: current.col + 1},
            {row: current.row, col: current.col - 1},
        ];

        for( var i = 0; i < next_list.length; i++ ) {
            var next = next_list[i];
            if( !can_move( next ) ) {
                continue;
            }

            var next_g = g.get(current) + 1;
            if( !g.has(next) || next_g < g.get(next) ) {
                g.set(next, next_g);
                parents.set(next, current);
                
                var score = next_g + manhattan_distance(next, target);
                if( open.has( next ) ) {
                    open.update(next, score);
                } else if( !closed.has(to_string(next)) ) {
                    open.push(next, score);
                }
            }
        }
    }

    if( end == null ) {
        return start;
    }

    // rebuilds the path by searching thought the parents list up to the start
    var child = end;
    var next = end;
    while( parents.get(next) != null ) {
        child = next;
        next = parents.get(next);
    }

    // returns the next node after the starting one
    return child;
}

function to_string(obj) {
    return '{' + obj.row + ',' + obj.col + '}';
}

function manhattan_distance(start, end) {
    var h = Math.abs(end.col - start.col);
    var v = Math.abs(end.row - start.row);
    return h + v;
}
