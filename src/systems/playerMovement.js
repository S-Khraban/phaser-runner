export function createPlayerMovement(player, controls) {
  const accel = 1200;

  return {
    update() {
      if (controls.left()) player.body.setAccelerationX(-accel);
      else if (controls.right()) player.body.setAccelerationX(accel);
      else player.body.setAccelerationX(0);
    },
  };
}
