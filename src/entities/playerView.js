// src/entities/playerView.js
export function createPlayerView(scene, player) {
  const PICKAXE = {
    KEY: 'axe',
    OFFSET_X: 10,
    OFFSET_Y: 5,
    SCALE: 0.05,
    BASE_ANGLE: 45,
  };

  const NOSE = {
    OFFSET_X: 10,
    OFFSET_Y: -6,
    R: 2,
    COLOR: 0x111111,
  };

  const pickaxeView = scene.add.image(
    player.x + PICKAXE.OFFSET_X,
    player.y + PICKAXE.OFFSET_Y,
    PICKAXE.KEY
  );
  pickaxeView.setOrigin(0.5, 1);
  pickaxeView.setScale(PICKAXE.SCALE);
  pickaxeView.setDepth(20);
  pickaxeView.angle = PICKAXE.BASE_ANGLE;

  const nose = scene.add.circle(
    player.x + NOSE.OFFSET_X,
    player.y + NOSE.OFFSET_Y,
    NOSE.R,
    NOSE.COLOR
  );
  nose.setDepth(20);

  let swingTween = null;

  function getFacing() {
    return player?.getData?.('facing') === -1 ? -1 : 1;
  }

  function hasPickaxe() {
    return !!player?.getData?.('hasPickaxe');
  }

  function isCarrying() {
    return !!player?.getData?.('isCarrying');
  }

  function isVisible() {
    const body = player?.getData?.('bodyView');
    return !!(body && body.active && body.visible);
  }

  function swingPickaxe() {
    if (!pickaxeView) return;
    if (!hasPickaxe() || !isVisible() || isCarrying()) return;

    if (swingTween) {
      swingTween.stop();
      swingTween = null;
    }

    const facing = getFacing();
    pickaxeView.angle = PICKAXE.BASE_ANGLE;

    const swing = 70;

    swingTween = scene.tweens.add({
      targets: pickaxeView,
      angle: PICKAXE.BASE_ANGLE + swing * facing,
      duration: 80,
      yoyo: true,
      onComplete: () => {
        if (pickaxeView) pickaxeView.angle = PICKAXE.BASE_ANGLE;
        swingTween = null;
      },
    });
  }

  function update() {
    const facing = getFacing();
    const visible = isVisible();
    const pickaxe = hasPickaxe();
    const carrying = isCarrying();

    nose.setVisible(visible);
    if (visible) {
      nose.setPosition(
        player.x + facing * NOSE.OFFSET_X,
        player.y + NOSE.OFFSET_Y
      );
    }

    if (carrying && swingTween) {
      swingTween.stop();
      swingTween = null;
      pickaxeView.angle = PICKAXE.BASE_ANGLE;
    }

    const showPickaxe = visible && pickaxe && !carrying;

    pickaxeView.setVisible(showPickaxe);
    if (showPickaxe) {
      pickaxeView.setPosition(
        player.x + facing * PICKAXE.OFFSET_X,
        player.y + PICKAXE.OFFSET_Y
      );
      pickaxeView.scaleX = facing * Math.abs(PICKAXE.SCALE);
      if (!swingTween) pickaxeView.angle = PICKAXE.BASE_ANGLE;
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
