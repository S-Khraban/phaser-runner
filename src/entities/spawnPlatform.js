export function spawnPlatform(scene, platforms, x, y, w, opts = {}) {
  const { h = 26, texKey = 'platform', depth = 0 } = opts;

  const p = scene.add.rectangle(x, y, w, h, 0x000000, 0);
  scene.physics.add.existing(p, true);

  const view = scene.add.image(x, y, texKey);
  view.setOrigin(0.5, 0.5);
  view.setDisplaySize(w, h);
  view.setDepth(depth);

  p.setDataEnabled();
  p.setData('view', view);

  platforms.add(p);

  return p;
}
