import Phaser from 'phaser';

const TEX_KEY = 'heart';
const W = 34;
const H = 30;

function ensureTexture(scene) {
  if (scene.textures.exists(TEX_KEY)) return;

  const g = scene.add.graphics();
  g.fillStyle(0xff2d55, 1);

  const cx = W / 2;
  const cy = H / 2;

  g.fillCircle(cx - 6, cy - 4, 7);
  g.fillCircle(cx + 6, cy - 4, 7);

  g.beginPath();
  g.moveTo(cx - 13, cy - 1);
  g.lineTo(cx, H - 2);
  g.lineTo(cx + 13, cy - 1);
  g.closePath();
  g.fillPath();

  g.generateTexture(TEX_KEY, W, H);
  g.destroy();
}

export function spawnHeart(scene, opts = {}) {
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
