"use strict";

// supported shapes.
const PHYSIC_SHAPE = {
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
};

// callbacks that check for collisions against different shapes.
const COLLISION_RESOLVERS = {};

/**
 * Attaches a physics component to an entity.
 * 
 * @param entity Entity to attach the component to.
 * @param coords Vector2 indicating the component's position in the map.
 * @param angle Orientation of the body.
 * @param shape Body shape (see helper functions to create shapes).
 */
function physics_component_add(entity, coords, angle, shape) {
    var data = {
        pos: coords,
        angle: angle,
        shape: shape,
        speed: new Vector2(0, 0),
        angular_speed: 0,
    };
    entity_manager_add_component(entity, COMPONENT.PHYSICS, data);
}

/**
 * Helper function to create a square shape.
 * 
 * @param size Size of the sides of the square.
 */
function physics_create_square_shape(size) {
    return {
        type: PHYSIC_SHAPE.RECTANGLE,
        width: size,
        height: size,
    };
}

/**
 * Helper function to create a circular shape.
 * 
 * @param radius Circle radius.
 */
function physics_create_circular_shape(radius) {
    return {
        type: PHYSIC_SHAPE.CIRCLE,
        radius: radius,
    };
}

/**
 * Returns the bounding box of a given shape.
 * 
 * @param body Physics component.
 */
function physics_get_body_bb(body) {
    switch(body.shape.type) {
        case PHYSIC_SHAPE.CIRCLE:
            return {
                min: new Vector2(body.pos.x - body.shape.radius, body.pos.y - body.shape.radius),
                max: new Vector2(body.pos.x + body.shape.radius, body.pos.y + body.shape.radius),
            }
        case PHYSIC_SHAPE.RECTANGLE:
            return {
                min: new Vector2(body.pos.x - body.shape.width / 2, body.pos.y - body.shape.width / 2),
                max: new Vector2(body.pos.x + body.shape.width / 2, body.pos.y + body.shape.width / 2),
            }
        default:
            throw new Error("Unexpected shape " + body.shape.type);
    }
}

/**
 * Tests if 2 body's bounding boxes overlap.
 * 
 * @param body1 Physics component of the first body.
 * @param body2 Physics component of the second body.
 */
function physics_test_bb_overlap(body1, body2) {
    const bb1 = physics_get_body_bb(body1);
    const bb2 = physics_get_body_bb(body2);

    return physics_test_bb_overlaps_bb(bb1, bb2);
}

/**
 * Tests if 2 bounding boxes overlap.
 * 
 * @param bb1 Bounding box.
 * @param bb2 Bounding box.
 */
function physics_test_bb_overlaps_bb(bb1, bb2) {
    const x_overlap = ( bb1.max.x > bb2.min.x ) && ( bb2.max.x > bb1.min.x );
    const y_overlap = ( bb1.max.y > bb2.min.y ) && ( bb2.max.y > bb1.min.y );

    return ( x_overlap && y_overlap );
}

/**
 * Tests if 2 body's overlap.
 * 
 * @param body1 Physics component of the first body.
 * @param body2 Physics component of the second body.
 */
function physics_test_collision(body1, body2) {
    // tests the bounding boxes
    if( !physics_test_bb_overlap(body1, body2) ) {
        return false;
    }

    // special case for rectangle vs rectangle that collision test equals to BB test
    if( body1.shape.type == body2.shape.type && body1.shape.type == PHYSIC_SHAPE.RECTANGLE ) {
        return true;
    }

    switch( body1.shape.type ) {
        case PHYSIC_SHAPE.RECTANGLE:
            return _collision_test_rectangle_vs_shape(body1, body2);
        case PHYSIC_SHAPE.CIRCLE:
            return _collision_test_circle_vs_shape(body1, body2);
        default:
            throw new Error("Unexpected shape " + body1.shape.type);
    }
}

/**
 * Tests collision between a rectangle and another body.
 * 
 * @param rectangle Rectangle shaped body.
 * @param body2 Other body to test. 
 */
function _collision_test_rectangle_vs_shape(rectangle, body2) {
    switch( body2.shape.type ) {
        case PHYSIC_SHAPE.CIRCLE:
            return _collision_test_rectangle_vs_circle(rectangle, body2);
        default:
            throw new Error("Unexpected shape " + body2.shape.type);
    }
}

/**
 * Tests collision between a circle and another body.
 * 
 * @param circle Circle shaped body.
 * @param body2 Other body to test. 
 */
function _collision_test_circle_vs_shape(circle, body2) {
    switch( body2.shape.type ) {
        case PHYSIC_SHAPE.CIRCLE:
            // if the distance between the centers is larger than the sum of
            // the radiuses, then they are colliding.
            var distance = circle.pos.distanceTo(body2.pos);
            return ( distance < ( circle.shape.radius + body2.shape.radius ) );
        case PHYSIC_SHAPE.RECTANGLE:
            return _collision_test_rectangle_vs_circle(body2, circle);
        default:
            throw new Error("Unexpected shape " + body2.shape.type);
    }
}

/**
 * Tests for collision between a rectangle and a circle.
 * 
 * @param rectangle Rectangle shaped physics component.
 * @param circle Circle shaped physics component.
 */
function _collision_test_rectangle_vs_circle(rectangle, circle) {
    // temporary variables to set edges for testing
    var testX = circle.pos.x;
    var testY = circle.pos.y;

    const rx = rectangle.pos.x - rectangle.shape.width / 2;
    const ry = rectangle.pos.y - rectangle.shape.height / 2;

    const rw = rectangle.shape.width;
    const rh = rectangle.shape.height;
    
    // which edge is closest?
    if( circle.pos.x < rx ) {
        testX = rx; // test left edge
    } else if( circle.pos.x > rx+rw ) {
        testX = rx + rw; // right edge
    }
    if( circle.pos.y < ry ) {
        testY = ry; // top edge
    } else if( circle.pos.y > ry+rh ) {
        testY = ry + rh; // bottom edge
    }
    
    // get distance from closest edges
    var dist_x = circle.pos.x - testX;
    var dist_y = circle.pos.y - testY;
    var distance_sqrd = ( dist_x * dist_x ) + ( dist_y * dist_y );
    
    // compares the square of the distance to the square of the radius
    return ( distance_sqrd < (circle.shape.radius * circle.shape.radius) );
}
