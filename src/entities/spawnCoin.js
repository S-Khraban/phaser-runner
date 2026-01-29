export function spawnCoin(scene, items, x, y) {
  const coin = scene.add.rectangle(x, y, 18, 18, 0xffd34a);
  scene.physics.add.existing(coin, true);

  coin.setDataEnabled();
  coin.setData('type', 'coin');

  items.add(coin);
  return coin;
}
