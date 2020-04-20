"use strict";


/**
 * Updates the sprites changing the frames if they have more than 1.
 * 
 * @param dt Elapsed time since last call to this function.
 */
function sprite_update(dt) {
    var entities = entity_manager_get_with_component(COMPONENT.SPRITE);
    for( var entity in entities ) {
        var sprite = entities[entity];

        var blink = entity_manager_get_component(entity, COMPONENT.SPRITE_BLINK);
        if( blink !== undefined ) {
            blink.elapsed_since_last_frame += dt;
            if( blink.elapsed_since_last_frame >= blink.period ) {
                // toggles the animation
                sprite.off = !sprite.off;
                blink.elapsed_since_last_frame = false;
            }
        }

        if( !sprite.animated || sprite.stopped ) {
            continue;
        }

        sprite.elapsed_since_last_frame += dt;
        while( sprite.elapsed_since_last_frame >= sprite.data.frame_rate ) {
            sprite.elapsed_since_last_frame -= sprite.data.frame_rate;
            sprite.current_frame = (sprite.current_frame + 1) % sprite.data.frames.length;
        }
    }
}

/**
 * Handles the drawing of the sprites components.
 * 
 * @param renderer Renderer. 
 */
function sprite_draw(renderer) {
    var entities = entity_manager_get_with_component(COMPONENT.SPRITE);
    for( var entity in entities ) {
        var sprite = entities[entity];

        if( sprite.off ) {
            continue;
        }

        // checks if it has a physics component to get the location from
        var physics = entity_manager_get_component(entity, COMPONENT.PHYSICS);
        if( physics !== undefined ) {
            _render_dynamic_sprite(renderer, physics, sprite);
            continue;
        }
        
        var draw_params = entity_manager_get_component(entity, COMPONENT.DRAW_PARAMS);
        if( draw_params === undefined ) {
            throw new Error( "No location information found in sprite" );
        }
        _render_static_sprite(renderer, sprite, draw_params);
    }
}

/**
 * Renders a sprite reading the parameters from the physics component.
 * 
 * @param renderer Renderer.
 * @param physics Physics component.
 * @param sprite Sprite component.
 */
function _render_dynamic_sprite(renderer, physics, sprite) {
    if( sprite.animated ) {
        var frame = sprite.data.frames[sprite.current_frame];
    } else {
        var frame = sprite.data;
    }
    renderer.draw_sprite(
        frame,
        physics.pos.x, physics.pos.y, TILE_SIZE, TILE_SIZE, physics.angle);
}

/**
 * Draws the sprite to the screen.
 * 
 * @param sprite Sprite component.
 * @param draw_params Draw parameters component.
 */
function _render_static_sprite(renderer, sprite, draw_params) {
    if( sprite.animated ) {
        var frame = sprite.data.frames[sprite.current_frame];
    } else {
        var frame = sprite.data;
    }

    var width = draw_params.width;
    var height = draw_params.height;
    if( height === null ) {
        // keep aspect ratio
        height = (width / frame.clip.width) * frame.clip.height;
    } else if( width === null ) {
        // keep aspect ratio
        width = (height / frame.clip.height) * frame.clip.width;
    }

    if( draw_params.draw_on_screen ) {
        renderer.draw_screen(frame, draw_params.x, draw_params.y, width, height);
    } else {
        renderer.draw_sprite(frame, draw_params.x, draw_params.y, width, height, 0);
    }
}