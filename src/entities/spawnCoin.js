export function spawnCoin(scene, items, x, y) {
  const t = scene.add.rectangle(x, y, 18, 18, 0xffd34a);
  scene.physics.add.existing(t, true);
  items.add(t);
  return t;
}
