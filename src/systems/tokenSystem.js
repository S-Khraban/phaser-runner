export function setupTokenSystem(scene, { player, items, hud }) {
  scene.physics.add.overlap(player, items, (_p, item) => {
    const key = item?.texture?.key || item?.frame?.texture?.key || '';

    if (typeof item.disableBody === 'function') {
      item.disableBody(true, true);
    } else if (typeof item.destroy === 'function') {
      item.destroy();
    }

    if (key === 'pickaxe') {
      hud?.addToken?.();
      return;
    }

    if (key === 'heart') {
      hud?.addToken?.();
      return;
    }

    hud?.addToken?.();
  });
}
