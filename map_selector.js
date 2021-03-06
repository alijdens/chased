"use strict";

// the map currently being played
var _current_map = 0;

const TEST_MAP = `
XXXXXXXXXXXXXXXXXXXXXXXXXXX
X     C |  |     |        X
X - -----  |     |   C C  X
X      o        F|        X
X - -- -------------------X
X         C             F X
X-- --------     |   XX   X
X         |      |        X
X   -|    |   -----     --X
X--  |    |   ---------  -X
X    |    |   - F       F X
X  --|    |   -----  -----X
X    |        |           X
X    |        |    F      X
X--  |-------------       X
X      P  |C      C       X
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
Xo     --   X
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

const MAP_6 = `
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

const MAP_7 = `
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

const MAP_8 = `
XXXXXXXXXXXXXXXXX
X               X
X  X X  o  X    X
X X  X     X  X X
X X  X     X  X X
X X  X     X  X X
XCX  X  P  X  XCX
X    X     X  X X
X               X
X      X X      X
X      X X      X
X      X X      X
X      X X      X
X      X X      X
X      X X      X
X       o       X
XXXXXXXXXXXXXXXXX
`;

const MAP_9 = `
XXXXXXXXXXXXXXX
X    X o X    X
X XX X X X XX X
X XX X   X XX X
X    XX XX    X
XXXXX X X XXXXX
XF  XXX XXX   X
XoX    P    XoX
X   XXX XXX   X
XXXXX X X XXXXX
X    XX XX    X
X XX X   X XX X
X XX X X X XX X
X    X o X    X
XXXXXXXXXXXXXXX
`;

const MAP_10 = `
XXXXXXXXXXXXXXXXXXXX
X     XFX          X
X     X X          X
X     X X          X
X      C           X
X   X XXXXXXX X    X
X   X         X    X
XXX X   XX    X    X
XF CX  P     oXC   X
XXX X         X XXXX
X   X   XXXX  X   FX
X       o     XXXXXX
X   XXXXXXXXX X    X
X      C           X
X     X X          X
X     XFX          X
XXXXXXXXXXXXXXXXXXXX
`;

const MAP_11 = `
XXXXXXXXXXXXXXXXXXXXXXXX
X      C              FX
X XX XXXXXXX XXXXX X XXX
X XX X  o  X Xo  X o X X
X XX X XXX X X X XXXXX X
X o  X XXX X X         X
XXXXXX XXX X XXXXXXXXX X
X   XX                 X
X   XX XXXXX X  XXXXXX X
X       X  X X         X
XXXXXXXXXX   XXXXX     X
X    X P       X       X
X XX X XXX      XXXXXX X
X XX X  XXXXXXX        X
X    X  X  o  X        X
X    X  X XXX X   XXX  X
X XX X  X XXX X   XXX  X
X XX X                 X
X    X                 X
XXXXXXXXXXXXXXXXXXXXXXXX
`;

const MAP_12 = `
XXXXXXXXXXXXXXXXXX
X XX  -FC        X
X XX  ------ - --X
X                X
X------- ------ -X
X      | |  o    X
X        X||     X
X   | |  |    |  X
X   | |  |-- --  X
X  C| | P     o  X
X   |     | |    X
X         -----  X
X           o    X
X        XXXXXXXXX
X                X
X  XXX           X
X  XXX           X
X                X
X       o        X
XXXXXXXXXXXXXXXXXX
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
    MAP_8,
    MAP_9,
    MAP_10,
    MAP_11,
    MAP_12,
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
