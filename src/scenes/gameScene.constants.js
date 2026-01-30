export const PLAYER_SPAWN = {
  x: 120,
  y: 200,
};

export const STAL = {
  SPAWN_EVERY: 6500,
  MIN_AHEAD: 360,
  MAX_AHEAD: 760,
  Y: -60,
  SPEED_Y: 180,
  RESPAWN_DELAY: 2200,
  RESPAWN_OFFSET: 50,
};

export const BREAK = {
  DIST: 70,
  DY: 60,
  COIN_MIN: 30,
  COIN_MAX: 50,
  COIN_Y: -10,
};

export const PARALLAX = {
  CAVE: {
    FACTOR: 0.8,
    DEPTH: -1000,
  },
  CAVE_BACK: {
    FACTOR: 0.5,
    DEPTH: -2000,
  },
};

const IMG = 'images/';

export const ASSETS = {
  BACKGROUND: {
    CAVE: {
      KEY: 'bg_cave',
      SRC: `${IMG}bg_cave.png`,
    },
    CAVE_BACK: {
      KEY: 'bg_cave_back',
      SRC: `${IMG}bg_cave_back.png`,
    },
  },

  PLAYER: {
    BOX: {
      KEY: 'box',
      SRC: `${IMG}box.png`,
    },

    IDLE: {
      KEY: 'player-idle',
      SRC: `${IMG}player-idle-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 6,
      ANIM_KEY: 'player_idle',
      FPS: 2,
    },
    IDLE_AXE: {
      KEY: 'player-idle-axe',
      SRC: `${IMG}player-idle-axe-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 6,
      ANIM_KEY: 'player_idle_axe',
      FPS: 2,
    },

    JUMP: {
      KEY: 'player-jump',
      SRC: `${IMG}player-jump.png`,
    },
    JUMP_AXE: {
      KEY: 'player-jump-axe',
      SRC: `${IMG}player-jump-axe.png`,
    },

    HOLD: {
      KEY: 'player-hold',
      SRC: `${IMG}player-hold.png`,
    },
    HOLD_ANIM: {
      KEY: 'player-hold-anim',
      SRC: `${IMG}player-hold-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 4,
      ANIM_KEY: 'player_hold_walk',
      FPS: 8,
    },

    PICKAXE_HIT_ANIM: {
      KEY: 'player-pickaxe-hit-anim',
      SRC: `${IMG}player-kick-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 2,
      ANIM_KEY: 'player:pickaxe-hit',
      FPS: 12,
    },

    KICK_ANIM: {
      KEY: 'player-kick-anim',
      SRC: `${IMG}player-kick-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 2,
      ANIM_KEY: 'player_kick',
      FPS: 10,
    },

    RUN_ANIM: {
      KEY: 'player-run-anim',
      SRC: `${IMG}player-run-animation.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 8,
      ANIM_KEY: 'player_run',
      FPS: 12,
      NO_AXE: { START: 0, END: 3 },
      AXE: { START: 4, END: 7 },
    },
  },

  WORLD: {
    PLATFORM: {
      KEY: 'platform',
      SRC: `${IMG}platform.png`,
    },
  },

  OBSTACLES: {
    ROCK: {
      KEY: 'rock',
      SRC: `${IMG}rock.png`,
    },
    STALACTITE: {
      KEY: 'stalactite',
      SRC: `${IMG}staloktut.png`,
    },
  },

  ITEMS: {
    COIN: {
      KEY: 'coin',
      SRC: `${IMG}coin-animation.png`,
      FRAME_WIDTH: 24,
      FRAME_HEIGHT: 24,
      FRAMES: 8,
    },
  },

  EFFECTS: {
    EXPLOSION: {
      KEY: 'explosion',
      SRC: `${IMG}explosion.png`,
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 5,
    },
  },

};
