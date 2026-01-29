export function bindPickaxeBreak(scene, { player, hud, playerView, tryBreakBox }) {
  scene.input.keyboard.on('keydown-SPACE', () => {
    if (!player.active || !player.visible) return;
    if (!hud.hasPickaxe()) return;

    playerView.swingPickaxe();
    tryBreakBox();
  });
}
