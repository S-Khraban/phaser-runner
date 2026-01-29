export function createPlayer(scene, { x, y }) {
  const player = scene.add.rectangle(x, y, 32, 48, 0x4aa3ff);
  scene.physics.add.existing(player);

  player.body.setCollideWorldBounds(false);
  player.body.setMaxVelocity(420, 900);
  player.body.setDragX(1400);

  return player;
}
