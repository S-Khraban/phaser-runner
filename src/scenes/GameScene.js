import Phaser from 'phaser';
import { LevelStream } from '../systems/LevelStream.js';

export default class GameScene extends Phaser.Scene {
  create() {
    const { height } = this.scale;

    this.physics.world.setBounds(0, 0, 999999, height);

    this.platforms = this.physics.add.staticGroup();
    this.items = this.physics.add.staticGroup();
    this.boxes = this.physics.add.group();
    this.rocks = this.physics.add.staticGroup();

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

    this.stream = new LevelStream(
      this,
      this.platforms,
      this.items,
      this.boxes,
      this.rocks
    );
    this.stream.init(0);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.boxes, this.platforms);
    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.collider(this.boxes, this.rocks);

    this.carriedBox = null;
    this.isCarrying = false;

    this.pickupDistance = 20;
    this.carryOffsetY = 56;
    this.throwVX = 320;
    this.throwVY = -280;

    this.physics.add.collider(this.player, this.boxes, (_p, box) => {
      if (this.isCarrying) return;

      const d = this.pickupDistance;

      const pb = this.player.getBounds();
      pb.x -= d;
      pb.y -= d;
      pb.width += d * 2;
      pb.height += d * 2;

      const bb = box.getBounds();
      const canPickup = Phaser.Geom.Intersects.RectangleToRectangle(pb, bb);

      if (canPickup) return;

      const pushingLeft = this.cursors.left.isDown || this.keyA.isDown;
      const pushingRight = this.cursors.right.isDown || this.keyD.isDown;
      if (!pushingLeft && !pushingRight) return;

      const inputDir = pushingRight ? 1 : -1;

      const correctSide =
        inputDir === 1 ? this.player.x < box.x : this.player.x > box.x;
      if (!correctSide) return;

      const pvx = this.player.body.velocity.x || 0;

      box.body.setVelocityX(pvx);
      if (box.body.velocity.y > 40) box.body.setVelocityY(40);

      this.player.body.setVelocityX(pvx * 0.7);
    });

    this.score = 0;
    this.scoreText = this.add
      .text(16, 16, 'Tokens: 0', {
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
        fontSize: '20px',
        color: '#ffffff',
      })
      .setScrollFactor(0);

    this.physics.add.overlap(this.player, this.items, (_p, token) => {
      token.destroy();
      this.score += 1;
      this.scoreText.setText(`Tokens: ${this.score}`);
    });

    this.physics.add.collider(this.boxes, this.rocks, (_r, b) => {
      const box = b;
      if (box === this.carriedBox) return;
      if (!box.body || !box.body.enable) return;
      if (box.__hitRock) return;

      box.__hitRock = true;
      this.spawnCoin(box.x, box.y - 24);
      box.destroy();
    });

    this.cam = this.cameras.main;
    this.cam.setBounds(0, 0, 999999, height);
    this.maxScrollX = 0;
    this.leftMargin = 0;
  }

  spawnCoin(x, y) {
    const t = this.add.rectangle(x, y, 18, 18, 0xffd34a);
    this.physics.add.existing(t, true);
    this.items.add(t);
  }

  tryPickupOrThrow() {
    if (this.isCarrying && this.carriedBox) {
      const box = this.carriedBox;

      this.isCarrying = false;
      this.carriedBox = null;

      box.body.enable = true;
      box.body.allowGravity = true;

      const pvx = this.player.body.velocity.x || 0;
      const dir = pvx !== 0 ? Math.sign(pvx) : 1;

      box.body.setVelocity(dir * this.throwVX, this.throwVY);
      return;
    }

    const d = this.pickupDistance;

    const pb = this.player.getBounds();
    pb.x -= d;
    pb.y -= d;
    pb.width += d * 2;
    pb.height += d * 2;

    let target = null;
    let best = Infinity;

    this.boxes.getChildren().forEach((box) => {
      if (!box.body || !box.body.enable) return;

      const bb = box.getBounds();
      if (!Phaser.Geom.Intersects.RectangleToRectangle(pb, bb)) return;

      const dx = this.player.x - box.x;
      const dy = this.player.y - box.y;
      const score = dx * dx + dy * dy;

      if (score < best) {
        best = score;
        target = box;
      }
    });

    if (!target) return;

    this.isCarrying = true;
    this.carriedBox = target;

    target.body.setVelocity(0, 0);
    target.body.allowGravity = false;
    target.body.enable = false;
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
      Phaser.Input.Keyboard.JustDown(this.keyW);

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-520);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.tryPickupOrThrow();
    }

    if (this.isCarrying && this.carriedBox) {
      this.carriedBox.x = this.player.x;
      this.carriedBox.y = this.player.y - this.carryOffsetY;
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
