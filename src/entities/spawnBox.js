const BODY_W = 40;
const BODY_H = 40;

function getPlatformTopAtX(platforms, x, y, maxDrop = 900) {
  if (!platforms?.getChildren) return null;

  const list = platforms.getChildren();
  let bestTop = Infinity;

  for (const raw of list) {
    const p = raw?.gameObject ?? raw;
    if (!p?.active || typeof p.getBounds !== 'function') continue;

    const b = p.getBounds();
    const withinX = x >= b.left && x <= b.right;
    const below = b.top >= y && b.top <= y + maxDrop;

    if (withinX && below && b.top < bestTop) bestTop = b.top;
  }

  return bestTop !== Infinity ? bestTop : null;
}

function getSafeBoxPos(platforms, x, y) {
  const top = getPlatformTopAtX(platforms, x, y);
  if (top == null) return { x, y };

  const halfH = BODY_H / 2;
  return { x, y: top - halfH };
}

export function spawnBox(scene, boxes, a, b, c) {
  const platforms = typeof a === 'number' ? scene?._g?.platforms : a;
  const x = typeof a === 'number' ? a : b;
  const y = typeof a === 'number' ? b : c;

  const safe = getSafeBoxPos(platforms, x, y);

  const box = scene.add.rectangle(safe.x, safe.y, BODY_W, BODY_H, 0x000000, 0);
  scene.physics.add.existing(box);

  box.body.setCollideWorldBounds(false);
  box.body.setBounce(0);
  box.body.setDragX(0);

  const view = scene.add.image(safe.x, safe.y, 'box');
  view.setOrigin(0.5, 0.5);
  view.setDisplaySize(BODY_W, BODY_H);

  box.setData('view', view);

  boxes.add(box);

  return box;
}
