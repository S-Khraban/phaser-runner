import Phaser from 'phaser';
import { LevelStream } from '../systems/LevelStream.js';

export default class GameScene extends Phaser.Scene {
  create() {
    const { width, height } = this.scale;

    this.physics.world.setBounds(0, 0, 999999, height);

    this.platforms = this.physics.add.staticGroup();

    this.player = this.add.rectangle(120, 200, 32, 48, 0x4aa3ff);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(false);
    this.player.body.setMaxVelocity(420, 900);
    this.player.body.setDragX(1400);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');
    this.keyW = this.input.keyboard.addKey('W');
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.stream = new LevelStream(this, this.platforms);
    this.stream.init(0);

    this.physics.add.collider(this.player, this.platforms);

    this.cam = this.cameras.main;
    this.cam.setBounds(0, 0, 999999, height);
    this.maxScrollX = 0;
    this.leftMargin = 0;
  }

  update() {
    const { width } = this.scale;

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

    const targetScrollX = this.player.x - width * (2 / 3);
    this.maxScrollX = Math.max(this.maxScrollX, targetScrollX);
    this.cam.scrollX = this.maxScrollX;

    const minPlayerX = this.cam.scrollX + this.leftMargin;
    if (this.player.x < minPlayerX) {
      this.player.x = minPlayerX;
      if (this.player.body.velocity.x < 0) this.player.body.setVelocityX(0);
    }

    this.stream.update(this.cam.scrollX);

    if (this.player.y > 1200) {
      this.player.setPosition(this.cam.scrollX + 120, 200);
      this.player.body.setVelocity(0, 0);
    }
  }
}
