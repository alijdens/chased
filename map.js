// Size of the tile in world coordinates
const TILE_SIZE = 10;

// Tile types.
const MAP_TILE = {
    EMPTY: 0,
    WALL: 1,
}

// configured map.
var _map = undefined;

/**
 * Parses a map from the serialized string representation and returns its.
 * 
 * @param level Serialized representation of the map.
 */
function map_parse(level) {
    var tiles = [];
    var max_columns = 0;

    var player_start = undefined;
    var chasers = [];
    var finders = [];
    var orbs = [];

    var lines = level.trim().split('\n');
    for( var i = 0; i < lines.length; i++ ) {
        var row = [];
        tiles.push(row);

        for( var j = 0; j < lines[i].length; j++ ) {
            switch( lines[i][j] ) {
                case '-':
                case '|':
                case 'X':
                    row.push(MAP_TILE.WALL);
                    break;
                case 'P':
                    row.push(MAP_TILE.EMPTY);
                    player_start = {row: i, col: j};
                    break;
                case 'C':
                    row.push(MAP_TILE.EMPTY);
                    chasers.push({row: i, col: j});
                    break;
                case ' ':
                    row.push(MAP_TILE.EMPTY);
                    break;
                case 'o':
                    row.push(MAP_TILE.EMPTY);
                    orbs.push({row: i, col: j});
                    break;
                case 'F':
                    row.push(MAP_TILE.EMPTY);
                    finders.push({row: i, col: j});
                    break;
                default:
                    throw new Error("Undefined game object: " + lines[i][j]);
            }
        }

        max_columns = Math.max(max_columns, row.length);
    }

    if( player_start === undefined ) {
        throw new Error("No player defined");
    }

    // precalculates the tile coordinates
    var tile_coords = [];
    for( var i = 0; i < tiles.length; i++ ) {
        const row = tiles[i];

        var coords_row = [];
        tile_coords.push(coords_row);
        for( var j = 0; j < row.length; j++ ) {
            coords_row.push(map_get_tile_coords(i, j));
        }
    }
    
    return {
        tiles: tiles,
        height: tiles.length,
        width: max_columns,
        player_start_position: player_start,
        chasers: chasers,
        finders: finders,
        orbs: orbs,
        tile_coords: tile_coords,
    };
}

/**
 * Configures a map globally.
 * 
 * @param map Parsed map.
 */
function map_set(map) {
    _map = map;
}

/**
 * Gets the configured map.
 */
function map_get() {
    return _map;
}

/**
 * Returns the position (row, column) of the tile at the given
 * coordinates.
 * 
 * @param map Map to query.
 * @param x X coordinate to query.
 * @param y Y coordinate to query.
 */
function map_get_tile_at(map, x, y) {
    var col = Math.floor(x / TILE_SIZE);
    var row = Math.floor(y / TILE_SIZE);
    return  {row: row, col: col};
}

/**
 * Given a point in map coordinates, returns the tile row and column
 * containing it.
 * 
 * @param map Map.
 * @param x Map X coordinate.
 * @param y Map Y coordinate.
 */
function map_get_tile_type(map, x, y) {
    var pos = map_get_tile_at(map, x, y);
    return map.tiles[pos.row][pos.col];
}

/**
 * Returns the coordinates of the center of a given tile.
 * 
 * @param row Row of the target tile.
 * @param col Column of the target tile.
 */
function map_get_tile_coords(row, col) {
    const x = col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    return new Vector2(x, y);
}

/**
 * Draws a map.
 * 
 * @param renderer Renderer.
 * @param map Map to draw.
 */
function map_draw(renderer, map) {
    for( var i = 0; i < map.tiles.length; i++ ) {
        const row = map.tiles[i];
        for( var j = 0; j < row.length; j++ ) {
            const tile_pos = map.tile_coords[i][j];

            switch( row[j] ) {
                case MAP_TILE.EMPTY:
                    renderer.draw_sprite(SPRITES.floor, tile_pos.x, tile_pos.y, TILE_SIZE, TILE_SIZE);
                    break;
                case MAP_TILE.WALL:
                    renderer.draw_sprite(SPRITES.wall, tile_pos.x, tile_pos.y, TILE_SIZE, TILE_SIZE);
                    break;
                default:
                    throw new Error("Undefined game object " + row[j]);
            }           
        }
    }
}
