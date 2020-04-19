var SPRITES = undefined;

function sprites_load(img) {
    SPRITES = {
        img: img,
        pixels_per_tile: 16,
        floor: {clip: {x: 128, y: 16}},
        wall: {clip: {x: 96, y: 32}},
        robot: {
            frames: [
                {clip: {x: 0, y: 0}},
                {clip: {x: 16, y: 0}}
            ],
            frame_rate: 1/3,
        },
        red_eyed_robot: {
            frames: [
                {clip: {x: 160, y: 0}},
                {clip: {x: 176, y: 0}}
            ],
            frame_rate: 1/3,
        },
        orb: {
            frames: [
                {clip: {x: 0, y: 16}},
                {clip: {x: 0, y: 32}}
            ],
            frame_rate: 1/2,
        },
        chaser: {
            frames: [
                {clip: {x: 96, y: 240}},
                {clip: {x: 112, y: 240}},
                {clip: {x: 128, y: 240}},
                {clip: {x: 144, y: 240}},
            ],
            frame_rate: 1/5,
        },
        game_won: {clip: {x: 208, y: 0, width: 782, height: 96}},
        game_lost: {clip: {x: 208, y: 112, width: 782, height: 96}},
        press_any_key_message: {clip: {x: 208, y: 226, width: 482, height: 40}},
    };
}
