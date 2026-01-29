export function createCameraFollow(scene, { height }) {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, 999999, height);

  let maxScrollX = 0;
  const leftMargin = 0;

  return {
    update(playerX, viewportWidth) {
      const targetScrollX = playerX - viewportWidth * (2 / 3);
      maxScrollX = Math.max(maxScrollX, targetScrollX);
      cam.scrollX = maxScrollX;

      const minPlayerX = cam.scrollX + leftMargin;
      return cam.scrollX;
    },
    getScrollX() {
      return cam.scrollX;
    },
    clampPlayer(player) {
      const minPlayerX = cam.scrollX + leftMargin;
      if (player.x < minPlayerX) {
        player.x = minPlayerX;
        if (player.body.velocity.x < 0) player.body.setVelocityX(0);
      }
    },
  };
}
