import { spawnCoin } from '../entities/spawnCoin.js';

export function setupColliders(
  scene,
  { player, platforms, boxes, rocks, boxCarry, items }
) {
  scene.physics.add.collider(player, platforms);
  scene.physics.add.collider(boxes, platforms);
  scene.physics.add.collider(player, rocks);

  scene.physics.add.overlap(
    player,
    boxes,
    (_p, box) => boxCarry.onPlayerBoxOverlap(_p, box),
    undefined,
    scene
  );

  scene.physics.add.overlap(
    boxes,
    rocks,
    (_b, _r) => {
      const box = _b?.gameObject ?? _b;
      if (!box?.body || !box.body.enable) return;

      if (box === boxCarry.getCarriedBox()) return;
      if (box.__hitRock) return;

      box.__hitRock = true;

      spawnCoin(scene, items, box.x, box.y - 24);

      const respawnX = scene.cameras.main.scrollX + scene.scale.width + 200;
      const respawnY = 200;

      box.setPosition(respawnX, respawnY);
      box.body.setVelocity(0, 0);
      box.body.allowGravity = true;
      box.body.enable = true;

      scene.time.delayedCall(0, () => {
        if (box && box.body) delete box.__hitRock;
      });
    },
    undefined,
    scene
  );
}
