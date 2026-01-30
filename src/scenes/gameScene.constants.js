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

export const ASSETS = {
  BACKGROUND: {
    CAVE: {
      KEY: 'bg_cave',
      SRC: 'bg_cave.png',
    },
    CAVE_BACK: {
      KEY: 'bg_cave_back',
      SRC: 'bg_cave_back.png',
    },
  },

  PLAYER: {
    BOX: {
      KEY: 'box',
      SRC: 'box.png',
    },
    AXE: {
      KEY: 'axe',
      SRC: 'axe.png',
    },

    IDLE: {
      KEY: 'player-idle',
      SRC: 'player-idle-animation.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 6,
      ANIM_KEY: 'player_idle',
      FPS: 2,
    },
    IDLE_AXE: {
      KEY: 'player-idle-axe',
      SRC: 'player-idle-axe-animation.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 6,
      ANIM_KEY: 'player_idle_axe',
      FPS: 2,
    },

    JUMP: {
      KEY: 'player-jump',
      SRC: 'player-jump.png',
    },
    JUMP_AXE: {
      KEY: 'player-jump-axe',
      SRC: 'player-jump-axe.png',
    },

    HOLD: {
      KEY: 'player-hold',
      SRC: 'player-hold.png',
    },
    HOLD_ANIM: {
      KEY: 'player-hold-anim',
      SRC: 'player-hold-animation.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 4,
      ANIM_KEY: 'player_hold_walk',
      FPS: 8,
    },

    KICK_ANIM: {
      KEY: 'player-kick-anim',
      SRC: 'player-kick-animation.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 2,
      ANIM_KEY: 'player_kick',
      FPS: 10,
    },

    PUSH_ANIM: {
      KEY: 'player-push-anim',
      SRC: 'player-push-animation.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 8,
      ANIM_KEY: 'player_push',
      FPS: 10,
      NO_AXE: { START: 0, END: 3 },
      AXE: { START: 4, END: 7 },
    },

    RUN_ANIM: {
      KEY: 'player-run-anim',
      SRC: 'player-run-animation.png',
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
      SRC: 'platform.png',
    },
  },

  OBSTACLES: {
    ROCK: {
      KEY: 'rock',
      SRC: 'rock.png',
    },
    STALACTITE: {
      KEY: 'stalactite',
      SRC: 'staloktut.png',
    },
  },

  ITEMS: {
    COIN: {
      KEY: 'coin',
      SRC: 'coin-animation.png',
      FRAME_WIDTH: 24,
      FRAME_HEIGHT: 24,
      FRAMES: 8,
    },
  },

  EFFECTS: {
    EXPLOSION: {
      KEY: 'explosion',
      SRC: 'explosion.png',
      FRAME_WIDTH: 50,
      FRAME_HEIGHT: 50,
      FRAMES: 5,
    },
  },

  UI: {
    FAVICON: {
      KEY: 'favicon',
      SRC: 'favicon.png',
    },
    LOGO: {
      KEY: 'vite',
      SRC: 'vite.svg',
    },
  },
};
