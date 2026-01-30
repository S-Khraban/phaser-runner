import { ensurePlayerPickaxeHitAnim, playPickaxeHitOnce } from '../anims/playerPickaxeHit.anim.js';

export function createPlayerView(scene, player) {
  const NOSE = {
    OFFSET_X: 10,
    OFFSET_Y: -6,
    R: 2,
    COLOR: 0x111111,
  };

  const nose = scene.add.circle(
    player.x + NOSE.OFFSET_X,
    player.y + NOSE.OFFSET_Y,
    NOSE.R,
    NOSE.COLOR
  );
  nose.setDepth(20);

  let isHitting = false;

  function getFacing() {
    return player?.getData?.('facing') === -1 ? -1 : 1;
  }

  function hasPickaxe() {
    return !!player?.getData?.('hasPickaxe');
  }

  function isCarrying() {
    return !!player?.getData?.('isCarrying');
  }

  function getBodyView() {
    const body = player?.getData?.('bodyView');
    return body && body.active ? body : null;
  }

  function isVisible() {
    const body = getBodyView();
    return !!(body && body.visible);
  }

  function swingPickaxe() {
    if (!hasPickaxe() || !isVisible() || isCarrying()) return;
    if (isHitting) return;

    const body = getBodyView();
    if (!body?.anims) return;

    ensurePlayerPickaxeHitAnim(scene);

    isHitting = true;

    playPickaxeHitOnce(body, {
      onDone: () => {
        isHitting = false;
      },
    });
  }

  function update() {
    const facing = getFacing();
    const visible = isVisible();

    nose.setVisible(visible);
    if (visible) {
      nose.setPosition(
        player.x + facing * NOSE.OFFSET_X,
        player.y + NOSE.OFFSET_Y
      );
    }

    if (isCarrying() && isHitting) isHitting = false;
  }

  function destroy() {
    nose?.destroy?.();
  }

  return {
    update,
    swingPickaxe,
    destroy,
  };
}
