import { ASSETS } from '../scenes/gameScene.constants.js';

export function getPlayerRunAnimKey(hasAxe) {
  const cfg = ASSETS?.PLAYER?.RUN_ANIM;
  if (!cfg?.ANIM_KEY) return null;
  return hasAxe ? `${cfg.ANIM_KEY}_axe` : cfg.ANIM_KEY;
}

export function createPlayerRunAnim(scene) {
  const cfg = ASSETS?.PLAYER?.RUN_ANIM;
  if (!scene || !cfg?.KEY || !cfg?.ANIM_KEY) return;

  if (!scene.anims.exists(cfg.ANIM_KEY)) {
    scene.anims.create({
      key: cfg.ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(cfg.KEY, {
        start: cfg.NO_AXE?.START ?? 0,
        end: cfg.NO_AXE?.END ?? Math.max(0, (cfg.FRAMES ?? 4) - 1),
      }),
      frameRate: cfg.FPS ?? 12,
      repeat: -1,
    });
  }

  const axeKey = `${cfg.ANIM_KEY}_axe`;
  if (!scene.anims.exists(axeKey)) {
    scene.anims.create({
      key: axeKey,
      frames: scene.anims.generateFrameNumbers(cfg.KEY, {
        start: cfg.AXE?.START ?? 0,
        end: cfg.AXE?.END ?? Math.max(0, (cfg.FRAMES ?? 8) - 1),
      }),
      frameRate: cfg.FPS ?? 12,
      repeat: -1,
    });
  }
}
