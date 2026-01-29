import Phaser from 'phaser';

export function createBoxCarrySystem(scene, { player, boxes, controls }) {
  let carriedBox = null;
  let isCarrying = false;

  const pickupDistance = 20;
  const carryOffsetY = 56;
  const throwVX = 320;
  const throwVY = -280;

  const pushFactor = 0.2;

  function toGO(obj) {
    return obj && obj.gameObject ? obj.gameObject : obj;
  }

  function getPickupRect() {
    const d = pickupDistance;
    const pb = player.getBounds();
    pb.x -= d;
    pb.y -= d;
    pb.width += d * 2;
    pb.height += d * 2;
    return pb;
  }

  function isInPickupRange(rawBox) {
    const box = toGO(rawBox);
    if (!box || typeof box.getBounds !== 'function') return false;

    return Phaser.Geom.Intersects.RectangleToRectangle(
      getPickupRect(),
      box.getBounds()
    );
  }

  function tryPickupOrThrow() {
    if (isCarrying && carriedBox) {
      const box = carriedBox;

      isCarrying = false;
      carriedBox = null;

      box.body.enable = true;
      box.body.allowGravity = true;

      const pvx = player.body.velocity.x || 0;
      const dir = pvx !== 0 ? Math.sign(pvx) : 1;

      box.body.setVelocity(dir * throwVX, throwVY);
      return;
    }

    let target = null;
    let best = Infinity;

    boxes.getChildren().forEach((b) => {
      const box = toGO(b);
      if (!box?.body || !box.body.enable) return;
      if (!isInPickupRange(box)) return;

      const dx = player.x - box.x;
      const dy = player.y - box.y;
      const score = dx * dx + dy * dy;

      if (score < best) {
        best = score;
        target = box;
      }
    });

    if (!target) return;

    isCarrying = true;
    carriedBox = target;

    target.body.setVelocity(0, 0);
    target.body.allowGravity = false;
    target.body.enable = false;
  }

  function onPlayerBoxOverlap(_p, rawBox) {
    const box = toGO(rawBox);
    if (!box?.body) return;
    if (isCarrying) return;

    const pushingLeft = controls.left();
    const pushingRight = controls.right();
    if (!pushingLeft && !pushingRight) return;

    const dir = pushingRight ? 1 : -1;

    const correctSide = dir === 1 ? player.x < box.x : player.x > box.x;
    if (!correctSide) return;

    const pvx = player.body.velocity.x || 0;

    box.body.setVelocityX(pvx * pushFactor);
    if (box.body.velocity.y > 40) box.body.setVelocityY(40);

    const pHalf = player.width / 2;
    const bHalf = box.width / 2;

    const targetX =
      dir === 1 ? box.x - bHalf - pHalf : box.x + bHalf + pHalf;

    if (dir === 1 && player.x > targetX) player.x = targetX;
    if (dir === -1 && player.x < targetX) player.x = targetX;

    player.body.setVelocityX(pvx * 0.7);
  }

  return {
    update() {
      if (controls.actionJustDown()) {
        tryPickupOrThrow();
      }

      if (isCarrying && carriedBox) {
        carriedBox.x = player.x;
        carriedBox.y = player.y - carryOffsetY;
      }
    },
    onPlayerBoxOverlap,
    isInPickupRange,
    getCarriedBox() {
      return carriedBox;
    },
    isCarrying() {
      return isCarrying;
    },
  };
}
