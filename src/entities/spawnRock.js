export function spawnRock(scene, rocks, x, y, r = 25, opts = {}) {
  const { texKey = 'rock', depth = 0 } = opts;

  const bodyGO = scene.add.circle(x, y, r, 0x000000, 0);
  scene.physics.add.existing(bodyGO, true);

  bodyGO.body.setCircle(r);
  bodyGO.body.setOffset(0, 0);

  const view = scene.add.image(x, y, texKey);
  view.setOrigin(0.5, 0.5);
  view.setDisplaySize(r * 2, r * 2);
  view.setDepth(depth);

  bodyGO.setDataEnabled();
  bodyGO.setData('view', view);

  rocks.add(bodyGO);

  return bodyGO;
}
