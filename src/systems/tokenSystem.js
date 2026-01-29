export function setupTokenSystem(scene, { player, items, hud }) {
  scene.physics.add.overlap(player, items, (_p, token) => {
    token.destroy();
    hud.addToken();
  });
}
