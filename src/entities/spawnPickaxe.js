import Phaser from 'phaser';

const TEX_KEY = 'pickaxe';
const W = 34;
const H = 34;

function ensureTexture(scene) {
  if (scene.textures.exists(TEX_KEY)) return;

  const g = scene.add.graphics();

  g.fillStyle(0x8e8e93, 1);
  g.fillRect(4, 6, 26, 10);

  g.fillStyle(0x2c2c2e, 1);
  g.fillRect(14, 6, 6, 24);

  g.generateTexture(TEX_KEY, W, H);
  g.destroy();
}

export function spawnPickaxe(scene, opts = {}) {
  ensureTexture(scene);

  const {
    x = Phaser.Math.Between(20, scene.scale.width - 20),
    y = 120,
    group,
    ttl = 12000,
  } = opts;

  const item = group
    ? group.create(x, y, TEX_KEY)
    : scene.physics.add.image(x, y, TEX_KEY);

  item.setOrigin(0.5, 0.5);

  if (item.body) {
    item.body.allowGravity = false;
    item.body.immovable = true;
    item.body.setVelocity?.(0, 0);
  }

  scene.time.delayedCall(ttl, () => {
    if (item?.destroy) item.destroy();
  });

  return item;
}
