import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  create() {
    const { width, height } = this.scale;

    this.physics.world.setBounds(0, 0, 999999, height);

    this.player = this.add.rectangle(120, 200, 32, 48, 0x4aa3ff);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setMaxVelocity(420, 900);
    this.player.body.setDragX(1400);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');
    this.keyW = this.input.keyboard.addKey('W');
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.ground = this.add.rectangle(width / 2, height - 40, width, 40, 0x2b2b2b);
    this.physics.add.existing(this.ground, true);

    this.physics.add.collider(this.player, this.ground);
  }

  update() {
    const left = this.cursors.left.isDown || this.keyA.isDown;
    const right = this.cursors.right.isDown || this.keyD.isDown;

    if (left) this.player.body.setAccelerationX(-1200);
    else if (right) this.player.body.setAccelerationX(1200);
    else this.player.body.setAccelerationX(0);

    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keyW) ||
      Phaser.Input.Keyboard.JustDown(this.keySpace);

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-520);
    }
  }
}
