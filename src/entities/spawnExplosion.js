import Phaser from 'phaser';
import { ASSETS } from '../scenes/gameScene.constants.js';

const ANIM_KEY = 'explosion_anim';

function ensureExplosionAnim(scene) {
  const { EXPLOSION } = ASSETS.EFFECTS;

  if (scene.anims.exists(ANIM_KEY)) return;

  scene.anims.create({
    key: ANIM_KEY,
    frames: scene.anims.generateFrameNumbers(EXPLOSION.KEY, {
      start: 0,
      end: EXPLOSION.FRAMES - 1,
    }),
    frameRate: 16,
    repeat: 0,
  });
}

export function spawnExplosion(scene, x, y, opts = {}) {
  ensureExplosionAnim(scene);

  const { EXPLOSION } = ASSETS.EFFECTS;

  const s = scene.add.sprite(x, y, EXPLOSION.KEY, 0);
  s.setOrigin(0.5, 0.5);

  const depth =
    opts.depth ??
    opts.aboveDepth ??
    (typeof opts.above === 'number' ? opts.above + 1 : null);

  if (depth != null) s.setDepth(depth);

  s.play(ANIM_KEY);
  s.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => s.destroy());

  return s;
}

export function destroyBoxWithExplosion(scene, box, opts = {}) {
  if (!box) return;

  const view = box.getData?.('view');
  const x = view?.x ?? box.x;
  const y = view?.y ?? box.y;

  const above =
    opts.above ??
    view?.depth ??
    box.depth ??
    (opts.player && (opts.player.getData?.('view')?.depth ?? opts.player.depth));

  spawnExplosion(scene, x, y, {
    ...opts,
    aboveDepth: opts.depth ?? (above != null ? above + 1 : 999),
  });

  if (view && view !== box) view.destroy();
  box.destroy();
}
