import Phaser from 'phaser';
import { ASSETS } from '../scenes/gameScene.constants.js';
import { ensurePlayerPickaxeHitAnim } from '../anims/playerPickaxeHit.anim.js';

const BODY_W = 32;
const BODY_H = 48;

const IDLE = ASSETS.PLAYER.IDLE;
const IDLE_AXE = ASSETS.PLAYER.IDLE_AXE;
const HOLD = ASSETS.PLAYER.HOLD;
const HOLD_ANIM = ASSETS.PLAYER.HOLD_ANIM;
const JUMP = ASSETS.PLAYER.JUMP;
const JUMP_AXE = ASSETS.PLAYER.JUMP_AXE;
const RUN = ASSETS.PLAYER.RUN_ANIM;

const HIT = ASSETS.PLAYER?.HIT_AXE ?? ASSETS.PLAYER?.KICK;

function ensureAnims(scene) {
  if (!scene.anims.exists(IDLE.ANIM_KEY)) {
    scene.anims.create({
      key: IDLE.ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(IDLE.KEY, {
        start: 0,
        end: (IDLE.FRAMES ?? 6) - 1,
      }),
      frameRate: IDLE.FPS ?? 6,
      repeat: -1,
    });
  }

  if (!scene.anims.exists(IDLE_AXE.ANIM_KEY)) {
    scene.anims.create({
      key: IDLE_AXE.ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(IDLE_AXE.KEY, {
        start: 0,
        end: (IDLE_AXE.FRAMES ?? 6) - 1,
      }),
      frameRate: IDLE_AXE.FPS ?? 6,
      repeat: -1,
    });
  }

  if (RUN?.KEY && RUN?.ANIM_KEY && !scene.anims.exists(RUN.ANIM_KEY)) {
    scene.anims.create({
      key: RUN.ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(RUN.KEY, {
        start: RUN.NO_AXE.START,
        end: RUN.NO_AXE.END,
      }),
      frameRate: RUN.FPS ?? 12,
      repeat: -1,
    });
  }

  const runAxeKey = RUN?.ANIM_KEY ? `${RUN.ANIM_KEY}_axe` : null;
  if (RUN?.KEY && runAxeKey && !scene.anims.exists(runAxeKey)) {
    scene.anims.create({
      key: runAxeKey,
      frames: scene.anims.generateFrameNumbers(RUN.KEY, {
        start: RUN.AXE.START,
        end: RUN.AXE.END,
      }),
      frameRate: RUN.FPS ?? 12,
      repeat: -1,
    });
  }

  if (HOLD_ANIM?.KEY && HOLD_ANIM?.ANIM_KEY && !scene.anims.exists(HOLD_ANIM.ANIM_KEY)) {
    scene.anims.create({
      key: HOLD_ANIM.ANIM_KEY,
      frames: scene.anims.generateFrameNumbers(HOLD_ANIM.KEY, {
        start: 0,
        end: (HOLD_ANIM.FRAMES ?? 4) - 1,
      }),
      frameRate: HOLD_ANIM.FPS ?? 8,
      repeat: -1,
    });
  }

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

function isRunning(player) {
  const vx = player?.body?.velocity?.x ?? 0;
  return Math.abs(vx) > 10;
}

function applyView(scene, player) {
  const bodyView = player?.getData?.('bodyView');
  if (!bodyView) return;

  if (
    bodyView.anims?.isPlaying &&
    bodyView.anims?.currentAnim?.key === 'player:pickaxe-hit'
  ) {
    return;
  }

  const carrying = isCarrying(player);
  const airborne = isAirborne(player);
  const running = isRunning(player);
  const axe = hasPickaxe(player);

  if (carrying) {
    if (running && HOLD_ANIM?.KEY && HOLD_ANIM?.ANIM_KEY) {
      if (bodyView.texture?.key !== HOLD_ANIM.KEY) {
        bodyView.anims?.stop?.();
        bodyView.setTexture(HOLD_ANIM.KEY);
        bodyView.setFrame?.(0);
      }
      if (bodyView.anims?.currentAnim?.key !== HOLD_ANIM.ANIM_KEY) {
        bodyView.play(HOLD_ANIM.ANIM_KEY, true);
      }
      return;
    }

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

  if (running && RUN?.KEY && RUN?.ANIM_KEY) {
    const runKey = axe ? `${RUN.ANIM_KEY}_axe` : RUN.ANIM_KEY;

    if (bodyView.texture?.key !== RUN.KEY) {
      bodyView.anims?.stop?.();
      bodyView.setTexture(RUN.KEY);
      bodyView.setFrame?.(0);
    }

    if (bodyView.anims?.currentAnim?.key !== runKey) {
      bodyView.play(runKey, true);
    }
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

    applyView(scene, player);
  };

  player.updateView();

  player.on('destroy', () => {
    const v = player.getData('bodyView');
    v?.destroy?.();
  });

  return player;
}
