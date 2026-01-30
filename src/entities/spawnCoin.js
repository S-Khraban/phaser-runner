export function spawnCoin(scene, items, x, y) {
  const coin = scene.physics.add.staticSprite(x, y, 'coin');

  coin.play('coin-spin');

  coin.setDataEnabled();
  coin.setData('type', 'coin');

  items.add(coin);
  items.refresh();

  return coin;
}
