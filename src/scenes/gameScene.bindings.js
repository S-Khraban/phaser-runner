export function bindPickaxeBreak(scene, { player, hud, playerView, tryBreakBox }) {
  let isLocked = false;
  const COOLDOWN = 140;

  scene.input.keyboard.on('keydown-SPACE', () => {
    if (isLocked) return;
    if (!player?.active || !player.visible) return;
    if (!hud?.hasPickaxe?.()) return;

    isLocked = true;

    playerView.swingPickaxe();
    tryBreakBox?.();

    scene.time.delayedCall(COOLDOWN, () => {
      isLocked = false;
    });
  });
}
