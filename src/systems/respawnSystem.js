export function createRespawnSystem(player, cameraFollow) {
  const fallY = 1200;

  return {
    update() {
      cameraFollow.clampPlayer(player);

      if (player.y > fallY) {
        player.setPosition(cameraFollow.getScrollX() + 120, 200);
        player.body.setVelocity(0, 0);
      }
    },
  };
}
