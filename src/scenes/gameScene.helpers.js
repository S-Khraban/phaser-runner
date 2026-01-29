import Phaser from 'phaser';
import { spawnCoin } from '../entities/spawnCoin.js';

function toGO(obj) {
  return obj && obj.gameObject ? obj.gameObject : obj;
}

export function destroyBox(box) {
  const b = toGO(box);
  if (!b) return;

  b.getData?.('view')?.destroy?.();
  b.destroy?.();
}

export function createRespawnBox() {
  return function respawnBox(rawBox) {
    const box = toGO(rawBox);
    if (!box) return;

    if (box.getData('spawnX') == null) box.setData('spawnX', box.x);
    if (box.getData('spawnY') == null) box.setData('spawnY', box.y);

    const bx = box.getData('spawnX');
    const by = box.getData('spawnY');

    if (box.disableBody && box.enableBody) {
      box.enableBody(true, bx, by, true, true);
    } else {
      box.setPosition(bx, by);
      box.setActive?.(true);
      box.setVisible?.(true);
      if (box.body) box.body.enable = true;
    }

    if (box.body) {
      box.body.setVelocity(0, 0);
      box.body.allowGravity = true;
    }

    const view = box.getData?.('view');
    if (view) {
      view.setPosition(box.x, box.y);
      view.setVisible(true);
      view.setActive?.(true);
    }
  };
}

export function isInFront(player, target) {
  const facing = player.getData('facing') || 1;
  return (target.x - player.x) * facing > 0;
}

export function getNearestBoxInFront(player, boxesGroup, { dist, dy }) {
  let best = null;
  let bestDist = dist;

  for (const raw of boxesGroup.getChildren()) {
    const box = toGO(raw);
    if (!box?.active) continue;

    const dx = box.x - player.x;
    const absDy = Math.abs(box.y - player.y);

    if (absDy > dy) continue;
    if (!isInFront(player, box)) continue;

    const d = Math.abs(dx);
    if (d <= bestDist) {
      bestDist = d;
      best = box;
    }
  }

  return best;
}

export function spawnCoinFromBox(scene, itemsGroup, player, box, cfg) {
  const facing = player.getData('facing') || 1;
  const offset = Phaser.Math.Between(cfg.COIN_MIN, cfg.COIN_MAX);

  const x = box.x + facing * offset;
  const y = box.y + cfg.COIN_Y;

  spawnCoin(scene, itemsGroup, x, y);
}
