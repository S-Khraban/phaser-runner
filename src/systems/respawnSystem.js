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

  const extraOnDeath = opts?.onDeath;

  function onDeath() {
    player?.setData?.('hasPickaxe', false);
    boxCarry?.drop?.();
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

  function respawnAtCamera() {
    onDeath();

    const baseX = cameraFollow.getScrollX() + SPAWN_OFFSET_X;
    const pos = getSafeSpawnPos(baseX);

    player.setPosition(pos.x, pos.y);
    player.body?.setVelocity?.(0, 0);
  }

  return {
    respawn: respawnAtCamera,

    update() {
      cameraFollow.clampPlayer(player);

      if (player.y > fallY) {
        respawnAtCamera();
      }
    },
  };
}
