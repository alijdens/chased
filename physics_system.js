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
    const displacement = new Vector2();

    // gets all the entities with physics components
    var entities = entity_manager_get_with_component(COMPONENT.PHYSICS);
    for( var entity1 in entities ) {
        var data = entities[entity1];

        // updates the position and rotation based on speed and elapsed time
        data.pos.addScaledVector(data.speed, frame_rate);
        data.angle = (data.angle + data.angular_speed * frame_rate) % MAX_ANGLE;

        let count = 0;
        do {

            displacement.set(0, 0);
            const map = map_get();
            
            _check_collisions_against_walls( map, data, displacement );
            _check_collisions_against_entities( entity1, entities, displacement );
    
            data.pos.add(displacement);
            count += 1;
        } while(displacement.length() > 0 && count < 20);
    }
}


/**
 * Checks if `entity1` is colliding with any other entities and adds the apporpriate
 * displacement.
 * 
 * @param entity1 Entity to check.
 * @param entities Other physical entities.
 * @param displacement Displacement vector where to add.
 */
function _check_collisions_against_entities(entity1, entities, displacement) {
    // tests collisions against other entities
    for( var entity2 in entities ) {
        if( entity1 != entity2 ) {
            const contact = physics_test_collision( entities[entity1], entities[entity2] );
            if( contact != false ) {
                collision_component_add( entity1, entity2, true );
                collision_component_add( entity2, entity1, false );

                // ignore ghost entities
                if (entity_manager_get_component( entity1, COMPONENT.GHOST_TAG ) ||
                    entity_manager_get_component( entity2, COMPONENT.GHOST_TAG )) {
                    continue;
                }

                displacement.add( contact.normal );
            }
        }
    }
}


/**
 * Checks for collisions between `body` and it's possible surroundings.
 * 
 * @param map Map.
 * @param body Body to check (physics component).
 * @param displacement Vector where to add the collision displacement.
 */
function _check_collisions_against_walls(map, body, displacement) {
    const cur_tile = map_get_tile_at(map, body.pos.x, body.pos.y);

    // lists all sorrounding cells
    const tiles = [
        map.tile_bodies[cur_tile.row + 1][cur_tile.col],
        map.tile_bodies[cur_tile.row + 1][cur_tile.col + 1],
        map.tile_bodies[cur_tile.row + 1][cur_tile.col - 1],
        map.tile_bodies[cur_tile.row - 1][cur_tile.col],
        map.tile_bodies[cur_tile.row - 1][cur_tile.col + 1],
        map.tile_bodies[cur_tile.row - 1][cur_tile.col - 1],
        map.tile_bodies[cur_tile.row][cur_tile.col - 1],
        map.tile_bodies[cur_tile.row][cur_tile.col + 1],
    ];

    // checks for collisions against all non-empty cells
    for( var i = 0; i < tiles.length; i++ ) {
        const tile_body = tiles[i];

        // empty tiles don't have an associated body
        if( tile_body === null ) {
            continue;
        }

        // checks for collisions against tile walls
        const contact = physics_test_collision( body, tile_body );
        if( contact == false ) {
            continue;
        }

        displacement.add( contact.normal );
    }
}