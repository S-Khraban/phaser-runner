import Phaser from 'phaser';

export function createControls(scene) {
  const cursors = scene.input.keyboard.createCursorKeys();

  const keyA = scene.input.keyboard.addKey('A');
  const keyD = scene.input.keyboard.addKey('D');
  const keyW = scene.input.keyboard.addKey('W');
  const keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  return {
    cursors,
    keyA,
    keyD,
    keyW,
    keySpace,
    left() {
      return cursors.left.isDown || keyA.isDown;
    },
    right() {
      return cursors.right.isDown || keyD.isDown;
    },
    jumpJustDown() {
      return (
        Phaser.Input.Keyboard.JustDown(cursors.up) ||
        Phaser.Input.Keyboard.JustDown(keyW)
      );
    },
    actionJustDown() {
      return Phaser.Input.Keyboard.JustDown(keySpace);
    },
  };
}
