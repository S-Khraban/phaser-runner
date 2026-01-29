import Phaser from 'phaser';

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
  wMin: 18,
  wMax: 22,
  hMin: 45,
  hMax: 53,
});

function ensureTexture(scene) {
  if (scene.textures.exists(TEX_KEY)) return;

  const W = Phaser.Math.Between(
    STALACTITE_DEFAULTS.wMin,
    STALACTITE_DEFAULTS.wMax
  );
  const H = Phaser.Math.Between(
    STALACTITE_DEFAULTS.hMin,
    STALACTITE_DEFAULTS.hMax
  );

  const g = scene.add.graphics();
  g.fillStyle(0xff3b30, 1);
  g.beginPath();
  g.moveTo(W / 2, H);
  g.lineTo(0, 0);
  g.lineTo(W, 0);
  g.closePath();
  g.fillPath();
  g.generateTexture(TEX_KEY, W, H);
  g.destroy();
}

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
  ensureTexture(scene);

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
    boxes,
    player,
    spawnPickaxe,
    spawnHeart,
    respawnPlayer,
    respawnSystem,
    onPlayerDeath,
  } = opts;

  const sx =
    typeof x === 'number'
      ? x
      : Phaser.Math.Between(minXPadding, scene.scale.width - minXPadding);

  const st = scene.physics.add.image(sx, y, TEX_KEY);
  st.setOrigin(0.5, 0.5);
  st.setImmovable(true);
  st.body.allowGravity = false;
  st.setVelocityY(speedY);

  const doRespawn = () => {
    const nx = Phaser.Math.Between(minXPadding, scene.scale.width - minXPadding);
    showGO(st, nx, STALACTITE_DEFAULTS.y);
    st.setVelocity(0, speedY);
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

    dropItem();

    if (box?.destroy) box.destroy();
    hideGO(st);

    scene.time.delayedCall(hideMsOnBoxHit, () => {});

    scene.time.delayedCall(stalRespawnMsOnBoxHit, () => {
      doRespawn();
    });
  };

  const onHitPlayer = () => {
    hideGO(st);
    if (!player) return;

    if (respawnSystem?.respawnNow) {
      respawnSystem.respawnNow();
    } else {
      onPlayerDeath?.();

      const px0 = player.x;
      const py0 = player.y;

      player.setActive?.(false);
      player.setVisible?.(false);
      if (player.body) player.body.enable = false;

      scene.time.delayedCall(respawnDelay, () => {
        if (typeof respawnPlayer === 'function') {
          respawnPlayer(player);
        } else {
          if (player.body) player.body.enable = true;
          player.setPosition?.(px0 ?? 120, py0 ?? 200);
          player.setActive?.(true);
          player.setVisible?.(true);
          player.body?.setVelocity?.(0, 0);
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

