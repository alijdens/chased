"use strict";


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
    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    draw_sprite(sprite, x, y, width, height, angle) {
        this.ctx.translate( x, y );
        this.ctx.rotate( -angle );

        this.ctx.drawImage(
            SPRITES.img,
            // WORKAROUND: the clip space is reduced a little or else the
            //             canvas draws the borders
            sprite.clip.x + 0.2, sprite.clip.y + 0.2,
            sprite.clip.width - 0.4, sprite.clip.height - 0.4,
            -width/2, -height/2, width, height
        );

        this.ctx.rotate( angle );
        this.ctx.translate( -x, -y );
    }
    draw_screen(sprite, x, y, scale) {        
        // calculate the scaled size
        var width = sprite.clip.width * scale;
        var height = sprite.clip.height * scale;

        var sx = this.ctx.canvas.width * x;
        var sy = this.ctx.canvas.height * y;
        
        this.ctx.translate( sx, sy );

        this.ctx.drawImage(
            SPRITES.img,
            // WORKAROUND: the clip space is reduced a little or else the
            //             canvas draws the borders
            sprite.clip.x + 0.2, sprite.clip.y + 0.2,
            sprite.clip.width - 0.4, sprite.clip.height - 0.4,
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
        this._width = width;
        this._height = height;
        this.x_scale = width / v_width;
        this.y_scale = height / v_height;
    }
    width() {
        return this._width;
    }
    height() {
        return this._height;
    }
    clear(color) {
        this.renderer.ctx.fillStyle = color;
        this.renderer.ctx.fillRect(this.x, this.y, this._width, this._height);
    }
    draw_sprite(sprite, x, y, width, height, angle) {
        this.renderer.draw_sprite(sprite,
                                  this.x + x * this.x_scale, this.y + y * this.y_scale,
                                  width * this.x_scale, height * this.y_scale,
                                  angle);
    }
    draw_screen(sprite, x, y, scale) {
        this.renderer.draw_screen(sprite, x, y, scale);
    }
};
