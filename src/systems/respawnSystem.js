export function createRespawnSystem(
  player,
  cameraFollow,
  boxCarry,
  platforms,
  opts = {}
) {
  const fallY = 1200;
  const SPAWN_OFFSET_X = 120;
  const SPAWN_FROM_TOP_Y = -60;
  const ABOVE_PLATFORM_Y = 200;
  const RIGHT_SEARCH_PX = 1800;
  const STEP_PX = 60;

  const RESPAWN_DELAY = opts?.respawnDelay ?? 1500;

  const extraOnDeath = opts?.onDeath;
  const explode =
    opts?.explode || opts?.spawnExplosion || opts?.onExplode || opts?.fx;

  let isDead = false;
  let respawnTimer = null;

  function getScene() {
    return player?.scene || opts?.scene;
  }

  function getPlayerTopDepth() {
    const view = player?.getData?.('view');
    const pickaxeView = player?.getData?.('pickaxeView');
    const d1 = typeof view?.depth === 'number' ? view.depth : null;
    const d2 =
      typeof pickaxeView?.depth === 'number' ? pickaxeView.depth : null;
    const d3 = typeof player?.depth === 'number' ? player.depth : null;

    const base =
      d2 != null
        ? d2
        : d1 != null
          ? d1
          : d3 != null
            ? d3
            : 0;

    return base;
  }

  function setAllVisible(v) {
    player?.setVisible?.(v);

    const view = player?.getData?.('view');
    view?.setVisible?.(v);

    const pickaxeView = player?.getData?.('pickaxeView');
    pickaxeView?.setVisible?.(v);

    player?.updateView?.();
  }

  function onDeath() {
    player?.setData?.('hasPickaxe', false);
    player?.setData?.('isCarrying', false);
    boxCarry?.drop?.();
    player?.updateView?.();
    extraOnDeath?.();
  }

  function getTopPlatformAtX(x) {
    const list = platforms?.getChildren?.() || [];
    if (!list.length) return null;

    let best = null;
    let bestTop = Infinity;

    for (const raw of list) {
      const p = raw?.gameObject ? raw.gameObject : raw;
      if (!p?.active || typeof p.getBounds !== 'function') continue;

      const b = p.getBounds();
      if (x >= b.left && x <= b.right) {
        if (b.top < bestTop) {
          bestTop = b.top;
          best = b;
        }
      }
    }

    return best;
  }

  function findSpawnPlatformRightFrom(x0) {
    const endX = x0 + RIGHT_SEARCH_PX;

    for (let x = x0; x <= endX; x += STEP_PX) {
      const b = getTopPlatformAtX(x);
      if (b) return { x, b };
    }

    return null;
  }

  function getSafeSpawnPos(x0) {
    const found = findSpawnPlatformRightFrom(x0);
    if (!found) return { x: x0, y: SPAWN_FROM_TOP_Y };

    return {
      x: found.x,
      y: found.b.top - ABOVE_PLATFORM_Y,
    };
  }

  function doRespawn() {
    const baseX = cameraFollow.getScrollX() + SPAWN_OFFSET_X;
    const pos = getSafeSpawnPos(baseX);

    player.setPosition(pos.x, pos.y);
    player.body?.setVelocity?.(0, 0);
    player.body && (player.body.enable = true);

    player?.setData?.('dead', false);
    setAllVisible(true);

    isDead = false;
    respawnTimer = null;
  }

  function kill(meta = {}) {
    if (isDead) return;

    const scene = getScene();
    if (!scene) return;

    isDead = true;

    player?.setData?.('dead', true);

    if (respawnTimer?.remove) respawnTimer.remove(false);
    respawnTimer = null;

    onDeath();

    player.body?.setVelocity?.(0, 0);
    player.body && (player.body.enable = false);

    const x = meta.x ?? player.x;
    const y = meta.y ?? player.y;
    const cause = meta.cause ?? 'unknown';

    const fxDepth =
      meta.depth ??
      opts?.fxDepth ??
      (getPlayerTopDepth() + (opts?.fxDepthOffset ?? 50));

    setAllVisible(false);

    if (typeof explode === 'function') {
      explode(scene, { x, y, cause, player, depth: fxDepth, above: fxDepth - 1 });
    }

    if (opts?.shake !== false) {
      scene.cameras?.main?.shake?.(120, 0.01);
    }

    respawnTimer = scene.time.delayedCall(RESPAWN_DELAY, doRespawn);
  }

  function respawnNow() {
    if (respawnTimer?.remove) respawnTimer.remove(false);
    respawnTimer = null;
    onDeath();
    doRespawn();
  }

  return {
    respawn: respawnNow,
    kill,

    update() {
      cameraFollow.clampPlayer(player);

      if (!isDead && player.y > fallY) {
        kill({ cause: 'fall' });
      }
    },
  };
}
