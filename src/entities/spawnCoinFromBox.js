import Phaser from 'phaser';
import { spawnCoin } from './spawnCoin.js';

export function spawnCoinFromBox(scene, items, player, box, cfg = {}) {
  if (!scene || !items || !box) return;

  const view = box.getData?.('view');
  const bx = view?.x ?? box.x;
  const by = view?.y ?? box.y;

  const facing = player?.getData?.('facing') === -1 ? -1 : 1;

  const baseShift = Phaser.Math.Between(15, 20) * facing;
  const spreadX = Phaser.Math.Between(-4, 4) + baseShift;
  const spreadY = Phaser.Math.Between(-4, 4);

  const coinYOffset = Phaser.Math.Between(40, 65);

  spawnCoin(
    scene,
    items,
    bx + spreadX,
    by - coinYOffset + spreadY
  );
}
