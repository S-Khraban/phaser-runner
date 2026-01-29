const BODY_W = 40;
const BODY_H = 40;

export function spawnBox(scene, boxes, x, y) {
  // 1) physics body (прозорий rect)
  const box = scene.add.rectangle(x, y, BODY_W, BODY_H, 0x000000, 0);
  scene.physics.add.existing(box);

  box.body.setCollideWorldBounds(false);
  box.body.setBounce(0);
  box.body.setDragX(0); // якщо треба — налаштуєш як у тебе було

  // 2) view (PNG)
  const view = scene.add.image(x, y, 'box');
  view.setOrigin(0.5, 0.5);

  // (опційно) щоб png був трошки більший/менший за колайдер:
  view.setDisplaySize(BODY_W, BODY_H);

  // звʼязок
  box.setData('view', view);

  // додай у групу коробок як і раніше
  boxes.add(box);

  return box;
}
