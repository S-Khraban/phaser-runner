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
