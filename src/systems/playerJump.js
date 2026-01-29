export function createPlayerJump(player, controls) {
  const jumpVY = -520;

  return {
    update() {
      if (controls.jumpJustDown() && player.body.blocked.down) {
        player.body.setVelocityY(jumpVY);
      }
    },
  };
}
