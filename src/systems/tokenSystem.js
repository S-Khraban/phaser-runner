export function setupTokenSystem(scene, { player, items, hud }) {
  scene.physics.add.overlap(player, items, (_p, item) => {
    const type = item?.getData?.('type');
    const key = item?.texture?.key || item?.frame?.texture?.key || '';

    if (type === 'pickaxe' || key === 'pickaxe') {
      player?.setData?.('hasPickaxe', true);

      if (typeof item.disableBody === 'function') {
        item.disableBody(true, true);
      } else if (typeof item.destroy === 'function') {
        item.destroy();
      }

      return;
    }

    if (typeof item.disableBody === 'function') {
      item.disableBody(true, true);
    } else if (typeof item.destroy === 'function') {
      item.destroy();
    }

    hud?.addToken?.();
  });
}
