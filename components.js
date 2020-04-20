"use strict";

// components enumerator.
const COMPONENT = {
    ROBOT_MOVE: 'robot_move',
    HUMAN_CONTROL: 'human_control',
    PHYSICS: 'physics',
    SPRITE: 'sprite',
    ORB_TAG: 'orb_tag',
    ORB_COLLECTOR_TAG: 'orb_collection_tag',
    COLLISION: 'collision',
    AI_STRAIGHT_CHASE: 'ai_straight_chase',
    AI_PATH_FINDER: 'ai_path_finder',
    POINT_AT: 'point_at',
    PLAYER_KILLER_TAG: 'player_killer_tag',
    DRAW_PARAMS: 'draw_params',
    SPRITE_BLINK: 'sprite_blink',
    MENU_CURSOR_TAG: 'menu_cursor_tag',
};

// systems enumerator
const SYSTEM = {
    ROBOT_MOVE: 'robot_move',
    PHYSICS: 'physics',
    SPRITE: 'sprite',
    COLLISION: 'collision',
    ORB_COLLECTOR: 'orb_collector',
    AI_STRAIGHT_CHASE: 'ai_straight_chase',
    AI_PATH_FINDER: 'ai_path_finder',
    POINT_AT: 'point_at',
    GAME_CHECK: 'game_check',
};