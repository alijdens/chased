"use strict";

function _get_draw_params(ctx, map) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const tile_size = Math.min(width / map.width, height / map.height);

    // the value from where to start drawing so the map is centered
    const x_offset = Math.max(0, width - tile_size * map.width) / 2;
    const y_offset = Math.max(0, height - tile_size * map.height) / 2;

    var scale = tile_size / TILE_SIZE;

    return {x: x_offset, y: y_offset, tile_size: tile_size, scale: scale};
}


class Renderer {
    constructor(ctx) {
        ctx.imageSmoothingEnabled = false;
        this.ctx = ctx;
    }
    width() {
        return this.ctx.canvas.width;
    }
    height() {
        return this.ctx.canvas.height;
    }
    clear_screen() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    draw_map(map) {
        for( var i = 0; i < map.tiles.length; i++ ) {
            const row = map.tiles[i];
            for( var j = 0; j < row.length; j++ ) {
                const tile_pos = map_get().tile_coords[i][j];

                switch( row[j] ) {
                    case MAP_TILE.EMPTY:
                        this.draw_sprite(SPRITES.floor, tile_pos.x, tile_pos.y, TILE_SIZE, TILE_SIZE);
                        break;
                    case MAP_TILE.WALL:
                        this.draw_sprite(SPRITES.wall, tile_pos.x, tile_pos.y, TILE_SIZE, TILE_SIZE);
                        break;
                    default:
                        throw new Error("Undefined game object " + row[j]);
                }           
            }
        }
    }
    draw_sprite(sprite, x, y, width, height, angle) {
        var params = _get_draw_params(this.ctx, map_get());

        var swidth = width * params.scale;
        var sheight = height * params.scale;
        var sx = x * params.scale + params.x;
        var sy = y * params.scale + params.y;

        this.ctx.translate( sx, sy );
        this.ctx.rotate( -angle );

        this.ctx.drawImage(
            SPRITES.img,
            // WORKAROUND: the clip space is reduced a little or else the
            //             canvas draws the borders
            sprite.clip.x + 0.2, sprite.clip.y + 0.2,
            SPRITES.pixels_per_tile - 0.4, SPRITES.pixels_per_tile - 0.4,
            -swidth/2, -sheight/2, swidth, sheight
        );

        this.ctx.rotate( angle );
        this.ctx.translate( -sx, -sy );
    }
    draw_screen(sprite, x, y, scale) {
        var clip_width = SPRITES.pixels_per_tile;
        var clip_height = SPRITES.pixels_per_tile;
        if( sprite.clip.width !== undefined ) {
            clip_width = sprite.clip.width;
        }
        if( sprite.clip.height !== undefined ) {
            clip_height = sprite.clip.height;
        }

        var params = _get_draw_params(this.ctx, map_get());
        
        // calculate the scaled size
        var width = clip_width * scale;
        var height = clip_height * scale;

        var sx = this.ctx.canvas.width * x;
        var sy = this.ctx.canvas.height * y;
        
        this.ctx.translate( sx, sy );

        this.ctx.drawImage(
            SPRITES.img,
            // WORKAROUND: the clip space is reduced a little or else the
            //             canvas draws the borders
            sprite.clip.x + 0.2, sprite.clip.y + 0.2,
            clip_width - 0.4, clip_height - 0.4,
            -width/2, -height/2, width, height
        );

        this.ctx.translate( -sx, -sy );
    }
};

class Viewport {
    constructor(renderer, x, y, width, height, v_width, v_height) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x_scale = width / v_width;
        this.y_scale = height / v_height;
    }
    clear_screen() {
        this.renderer.clearRect(this.x, this.y, this.width, this.height);
    }
    draw_sprite(sprite, x, y, width, height, angle) {
        this.renderer.draw_sprite(sprite,
                                  this.x + x * this.x_scale, this.y + y * this.y_scale,
                                  width * this.x_scale, height * this.y_scale,
                                  angle);
    }
    draw_screen(sprite, x, y, scale) {
        this.renderer.draw_screen(sprite, this.x, this.y, scale * Math.min(this.x_scale, this.y_scale));
    }
};
