// src/anims/playerPickaxeHit.anim.js
import { ASSETS } from '../scenes/gameScene.constants.js';

export const PLAYER_ANIMS = {
  PICKAXE_HIT: 'player:pickaxe-hit',
};

export function ensurePlayerPickaxeHitAnim(scene, textureKey) {
  const key = PLAYER_ANIMS.PICKAXE_HIT;

  if (!scene?.anims || scene.anims.exists(key)) return key;

  const cfg = ASSETS.PLAYER.PICKAXE_HIT_ANIM;
  const tex = textureKey ?? cfg.KEY;

  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNumbers(tex, { start: 0, end: 1 }),
    frameRate: cfg.FPS ?? 12,
    repeat: 0,
  });

  return key;
}

export function playPickaxeHitOnce(sprite, { onDone } = {}) {
  if (!sprite?.anims) return;

  const scene = sprite.scene;
  const animKey = ensurePlayerPickaxeHitAnim(scene);

  sprite.once('animationcomplete', (anim) => {
    if (anim?.key !== animKey) return;
    onDone?.();
  });

  sprite.anims.play(animKey, true);
}
