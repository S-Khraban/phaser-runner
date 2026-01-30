import Phaser from 'phaser';
import { destroyBoxWithExplosion } from './spawnExplosion.js';

const TEX_KEY = 'stalactite';

export const STALACTITE_DEFAULTS = Object.freeze({
  y: -60,
  speedY: 180,
  respawnOffset: 50,
  respawnDelay: 2200,
  minXPadding: 20,
  offscreenPadding: 200,
  hideMsOnBoxHit: 0,
  stalRespawnMsOnBoxHit: 150,
  wMin: 30,
  wMax: 35,
  hMin: 60,
  hMax: 75,
});

function rollDrop() {
  const r10 = Phaser.Math.Between(1, 2);
  if (r10 === 1) return 'pickaxe';

  const r20 = Phaser.Math.Between(1, 3);
  if (r20 === 1) return 'heart';

  return null;
}

function hideGO(go) {
  if (!go) return;

  if (typeof go.disableBody === 'function') {
    go.disableBody(true, true);
    return;
  }

  go.setActive?.(false);
  go.setVisible?.(false);

  if (go.body) {
    go.body.enable = false;
    go.body.setVelocity?.(0, 0);
  }
}

function showGO(go, x, y) {
  if (!go) return;

  if (typeof go.enableBody === 'function') {
    go.enableBody(true, x, y, true, true);
    return;
  }

  go.setPosition?.(x, y);
  go.setActive?.(true);
  go.setVisible?.(true);

  if (go.body) {
    go.body.enable = true;
    go.body.setVelocity?.(0, 0);
  }
}

function _spawnStalactite(scene, opts = {}) {
  const {
    x,
    y = STALACTITE_DEFAULTS.y,
    speedY = STALACTITE_DEFAULTS.speedY,
    respawnOffset = STALACTITE_DEFAULTS.respawnOffset,
    respawnDelay = STALACTITE_DEFAULTS.respawnDelay,
    minXPadding = STALACTITE_DEFAULTS.minXPadding,
    offscreenPadding = STALACTITE_DEFAULTS.offscreenPadding,
    hideMsOnBoxHit = STALACTITE_DEFAULTS.hideMsOnBoxHit,
    stalRespawnMsOnBoxHit = STALACTITE_DEFAULTS.stalRespawnMsOnBoxHit,
    wMin = STALACTITE_DEFAULTS.wMin,
    wMax = STALACTITE_DEFAULTS.wMax,
    hMin = STALACTITE_DEFAULTS.hMin,
    hMax = STALACTITE_DEFAULTS.hMax,
    boxes,
    player,
    spawnPickaxe,
    spawnHeart,
    respawnPlayer,
    respawnSystem,
    onPlayerDeath,
    group,
  } = opts;

  const sx =
    typeof x === 'number'
      ? x
      : Phaser.Math.Between(minXPadding, scene.scale.width - minXPadding);

  const st = group
    ? group.create(sx, y, TEX_KEY)
    : scene.physics.add.image(sx, y, TEX_KEY);

  st.setOrigin(0.5, 0.5);

  st.setDataEnabled?.();
  st.setData?.('type', 'stalactite');

  const w = Phaser.Math.Between(wMin, wMax);
  const h = Phaser.Math.Between(hMin, hMax);
  st.setDisplaySize(w, h);
  st.body?.setSize?.(w, h, true);

  st.setImmovable(true);
  if (st.body) st.body.allowGravity = false;
  st.setVelocityY(speedY);

  st.__hitPlayer = false;

  const doRespawn = () => {
    const nx = Phaser.Math.Between(minXPadding, scene.scale.width - minXPadding);

    const rw = Phaser.Math.Between(wMin, wMax);
    const rh = Phaser.Math.Between(hMin, hMax);
    st.setDisplaySize(rw, rh);
    st.body?.setSize?.(rw, rh, true);

    showGO(st, nx, STALACTITE_DEFAULTS.y);
    st.setVelocity(0, speedY);
    st.__hitPlayer = false;
  };

  const dropItem = () => {
    const drop = rollDrop();
    if (!drop) return;

    const dx = st.x + respawnOffset;
    const dy = st.y;

    if (drop === 'pickaxe' && typeof spawnPickaxe === 'function') {
      spawnPickaxe(scene, { x: dx, y: dy });
      return;
    }

    if (drop === 'heart' && typeof spawnHeart === 'function') {
      spawnHeart(scene, { x: dx, y: dy });
    }
  };

  const onHitBox = (_st, rawBox) => {
    const box = rawBox?.gameObject ? rawBox.gameObject : rawBox;

    scene._sfx?.boom?.();

    dropItem();

    destroyBoxWithExplosion(scene, box);
    hideGO(st);

    scene.time.delayedCall(hideMsOnBoxHit, () => {});

    scene.time.delayedCall(stalRespawnMsOnBoxHit, () => {
      doRespawn();
    });
  };

  const onHitPlayer = () => {
    if (st.__hitPlayer) return;
    st.__hitPlayer = true;

    hideGO(st);
    if (!player) return;

    const p = player?.gameObject ? player.gameObject : player;
    if (p?.getData?.('dead')) {
      scene.time.delayedCall(150, () => doRespawn());
      return;
    }

    if (typeof respawnSystem?.kill === 'function') {
      respawnSystem.kill({ cause: 'stalactite', x: p.x, y: p.y });
    } else {
      onPlayerDeath?.();

      const px0 = p.x;
      const py0 = p.y;

      p.setActive?.(false);
      p.setVisible?.(false);
      if (p.body) p.body.enable = false;

      scene.time.delayedCall(respawnDelay, () => {
        if (typeof respawnPlayer === 'function') {
          respawnPlayer(p);
        } else {
          if (p.body) p.body.enable = true;
          p.setPosition?.(px0 ?? 120, py0 ?? 200);
          p.setActive?.(true);
          p.setVisible?.(true);
          p.body?.setVelocity?.(0, 0);
        }
      });
    }

    scene.time.delayedCall(150, () => {
      doRespawn();
    });
  };

  if (boxes) {
    scene.physics.add.overlap(st, boxes, onHitBox);
  }

  if (player) {
    scene.physics.add.overlap(st, player, onHitPlayer);
  }

  const onUpdate = () => {
    if (!st.active || !st.body?.enable) return;
    if (st.y > scene.scale.height + offscreenPadding) doRespawn();
  };

  scene.events.on('update', onUpdate);

  st.respawn = doRespawn;
  st.cleanup = () => {
    scene.events.off('update', onUpdate);
    st.destroy();
  };

  return st;
}

export const spawnStalactite = _spawnStalactite;
