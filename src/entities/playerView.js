export function createPlayerView(scene, player) {
  const PICKAXE = {
    OFFSET_X: 14,
    WIDTH: 32,
    HEIGHT: 4,
    COLOR: 0x8d6e63,
  };

  const NOSE = {
    OFFSET_X: 10,
    OFFSET_Y: -6,
    R: 2,
    COLOR: 0x111111,
  };

  const pickaxeView = scene.add.rectangle(
    player.x + PICKAXE.OFFSET_X,
    player.y,
    PICKAXE.WIDTH,
    PICKAXE.HEIGHT,
    PICKAXE.COLOR
  );
  pickaxeView.setDepth(10);

  const nose = scene.add.circle(
    player.x + NOSE.OFFSET_X,
    player.y + NOSE.OFFSET_Y,
    NOSE.R,
    NOSE.COLOR
  );
  nose.setDepth(10);

  let swingTween = null;

  function getFacing() {
    return player?.getData?.('facing') === -1 ? -1 : 1;
  }

  function hasPickaxe() {
    return !!player?.getData?.('hasPickaxe');
  }

  function isVisible() {
    return !!(player && player.active && player.visible);
  }

  function swingPickaxe() {
    if (!pickaxeView) return;
    if (!hasPickaxe() || !isVisible()) return;

    if (swingTween) {
      swingTween.stop();
      swingTween = null;
    }

    pickaxeView.angle = 0;

    const facing = getFacing();
    const targetAngle = facing === 1 ? 70 : -70;

    swingTween = scene.tweens.add({
      targets: pickaxeView,
      angle: targetAngle,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        if (pickaxeView) pickaxeView.angle = 0;
        swingTween = null;
      },
    });
  }

  function update() {
    const facing = getFacing();
    const visible = isVisible();
    const pickaxe = hasPickaxe();

    nose.setVisible(visible);
    if (visible) {
      nose.setPosition(
        player.x + facing * NOSE.OFFSET_X,
        player.y + NOSE.OFFSET_Y
      );
    }

    pickaxeView.setVisible(visible && pickaxe);
    if (visible && pickaxe) {
      pickaxeView.setPosition(player.x + facing * PICKAXE.OFFSET_X, player.y);
      pickaxeView.scaleX = facing;
    }
  }

  function destroy() {
    if (swingTween) {
      swingTween.stop();
      swingTween = null;
    }
    nose?.destroy?.();
    pickaxeView?.destroy?.();
  }

  return {
    update,
    swingPickaxe,
    destroy,
  };
}
