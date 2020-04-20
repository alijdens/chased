"use strict";

// the map currently being played
var _current_map = 0;

const TEST_MAP = `
XXXXXXXXXXXXXXXXXXXXXXXXXXX
X  C    |  |     |        X
X - -----  |C    |   C C  X
X      o        F|        X
X - -- -------------------X
X                       F X
X-- --------     |   XX   X
X         |      |        X
X   -|    |   -----     --X
X--  |    |   ---------  -X
X    |    |   - F       F X
X  --|    |   -----  -----X
X    |        |           X
X    |        |           X
X--  |-------------       X
X      P  |C          F   X
XXXXXXXXXXXXXXXXXXXXXXXXXXX
`;

const MAP_1 = `
-------------
|           |
|      C    |
|    -----  |
|         - |
|o     P    |
|-----------|
`;

const MAP_2 = `
-----------------
|               |
|       C       |
|     -----     |
|    -     -    |
| --            |
|o      P      o|
|---------------|
`;

const MAP_3 = `
XXXXXXXXXXXXX
X           X
X           X
X    |o     X
X    | |    X
X  C-- |  P X
X o    --   X
X  ---      X
X    | -    X
X      |--  X
X     o     X
X           X
XXXXXXXXXXXXX
`;

const MAP_4 = `
XXXXXXXXXXXXXXXXX
X |             X
X | ----        X
X | |   ------- X
X | | |C        X
X | | ------| | X
X | |     | | | X
X | |--o|   | | X
X |P   ------ | X
X |--         | X
X     XXXXXXXX|oX
XXXXXXXXXXXXXXXXX
`;

const MAP_5 = `
XXXXXXXXXXXXXXXX
X          C   X
X          X   X
X   XX  o  X   X
X     XXXXX    X
X    oXXXXXo   X
X     XXX      X
X     XXX X    X
X    |  o  --  X
X |- |         X
X |        P   X
XXXXXXXXXXXXXXXX
`;

var MAP_6 = `
XXXXXXXXXXXXXXXXX
X         |     X
X | ------------X
X |           | X
X |---------- | X
X |       | | | X
X |     |   | | X
XP| --- --- | |CX
X |             X
X |---- ------| X
X              oX
XXXXXXXXXXXXXXXXX
`;

var MAP_7 = `
XXXXXXXXXXXXXXXXX
Xo  |         |PX
X | |- |- -- XX X
X | |  |   | XX X
X |   || X |  | X
X |---||o  |- | X
X  -- |  X |    X
XX  |     X   XXX
XX    | |  X X XX
XX ---| XX      X
XoC     XXXXXXXoX
XXXXXXXXXXXXXXXXX
`;

// list of maps
const MAPS = [
    //TEST_MAP,
    MAP_1,
    MAP_2,
    MAP_3,
    MAP_4,
    MAP_5,
    MAP_6,
    MAP_7,
];

function map_selector_get_current() {
    var map = map_parse(MAPS[_current_map]);
    // TODO: map shouldn't be set globally
    map_set(map);
    return map;
}

function map_selector_set_next() {
    _current_map = (_current_map + 1) % MAPS.length;
}

function map_selector_set(map_num) {
    _current_map = map_num;
}
