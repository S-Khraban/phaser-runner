import Phaser from 'phaser';
import { ASSETS } from '../scenes/gameScene.constants.js';
import { ensurePlayerPickaxeHitAnim } from '../anims/playerPickaxeHit.anim.js';

const BODY_W = 32;
const BODY_H = 48;

const IDLE = ASSETS.PLAYER.IDLE;
const IDLE_AXE = ASSETS.PLAYER.IDLE_AXE;
const HOLD = ASSETS.PLAYER.HOLD;
const JUMP = ASSETS.PLAYER.JUMP;
const JUMP_AXE = ASSETS.PLAYER.JUMP_AXE;

const HIT = ASSETS.PLAYER?.HIT_AXE ?? ASSETS.PLAYER?.KICK;

function ensureAnims(scene) {
  if (scene.anims.exists(IDLE.ANIM_KEY)) return;

  scene.anims.create({
    key: IDLE.ANIM_KEY,
    frames: scene.anims.generateFrameNumbers(IDLE.KEY, {
      start: 0,
      end: (IDLE.FRAMES ?? 6) - 1,
    }),
    frameRate: IDLE.FPS ?? 6,
    repeat: -1,
  });

  scene.anims.create({
    key: IDLE_AXE.ANIM_KEY,
    frames: scene.anims.generateFrameNumbers(IDLE_AXE.KEY, {
      start: 0,
      end: (IDLE_AXE.FRAMES ?? 6) - 1,
    }),
    frameRate: IDLE_AXE.FPS ?? 6,
    repeat: -1,
  });

  if (HIT?.KEY) {
    ensurePlayerPickaxeHitAnim(scene, HIT.KEY);
  }
}

function getFacing(player) {
  return player?.getData?.('facing') === -1 ? -1 : 1;
}

function hasPickaxe(player) {
  return !!player?.getData?.('hasPickaxe');
}

function isCarrying(player) {
  return !!player?.getData?.('isCarrying');
}

function isAirborne(player) {
  const b = player?.body;
  if (!b) return false;
  return !b.blocked?.down && !b.touching?.down;
}

function applyView(player) {
  const bodyView = player?.getData?.('bodyView');
  if (!bodyView) return;

  if (bodyView.anims?.isPlaying && bodyView.anims?.currentAnim?.key === 'player:pickaxe-hit') {
    return;
  }

  const carrying = isCarrying(player);
  const airborne = isAirborne(player);
  const axe = hasPickaxe(player);

  if (carrying) {
    bodyView.anims?.stop?.();
    bodyView.setTexture(HOLD.KEY);
    bodyView.setFrame?.(0);
    return;
  }

  if (airborne) {
    bodyView.anims?.stop?.();
    bodyView.setTexture(axe ? JUMP_AXE.KEY : JUMP.KEY);
    bodyView.setFrame?.(0);
    return;
  }

  const texKey = axe ? IDLE_AXE.KEY : IDLE.KEY;
  const animKey = axe ? IDLE_AXE.ANIM_KEY : IDLE.ANIM_KEY;

  if (bodyView.texture?.key !== texKey) {
    bodyView.anims?.stop?.();
    bodyView.setTexture(texKey);
    bodyView.setFrame?.(0);
  }

  if (bodyView.anims?.currentAnim?.key !== animKey) {
    bodyView.play(animKey, true);
  }
}

export function spawnIdlePlayer(scene, x, y) {
  const player = scene.add.rectangle(x, y, BODY_W, BODY_H, 0x000000, 0);
  scene.physics.add.existing(player);

  player.setAlpha(0);

  player.body.setCollideWorldBounds(false);
  player.body.setMaxVelocity(420, 900);
  player.body.setDragX(1400);

  player.setData('facing', 1);
  player.setData('hasPickaxe', false);
  if (player.getData('isCarrying') == null) player.setData('isCarrying', false);

  ensureAnims(scene);

  const bodyView = scene.add.sprite(x, y, IDLE.KEY, 0);
  bodyView.setOrigin(0.5, 0.5);
  bodyView.setDepth(10);

  player.setData('bodyView', bodyView);

  player.updateView = () => {
    const v = player.getData('bodyView');
    if (!v) return;

    v.x = player.x;
    v.y = player.y;

    const facing = getFacing(player);
    v.setFlipX(facing === -1);

    applyView(player);
  };

  player.updateView();

  player.on('destroy', () => {
    const v = player.getData('bodyView');
    v?.destroy?.();
  });

  return player;
}
