import Phaser from 'phaser';
import { destroyBox } from '../scenes/gameScene.helpers.js';

export class LevelStream {
  constructor(scene, platforms, items, boxes, rocks) {
    this.scene = scene;
    this.platforms = platforms;
    this.items = items;
    this.boxes = boxes;
    this.rocks = rocks;

    this.generatedUntilX = 0;
    this.cleanupPadding = 500;
    this.spawnAhead = 1600;

    this.lastY = 420;

    this.rockChance = 0.18;
    this.rockMinGap = 260;
    this.lastRockX = -999999;

    this.platformH = 26;
    this.rockR = 25;

    this.boxW = 34;
    this.boxH = 34;
    this.boxTexKey = 'box';
  }

  init(startX = 0) {
    this.generatedUntilX = startX;

    for (let i = 0; i < 10; i += 1) {
      this.spawnPlatform(this.generatedUntilX, this.lastY, 240);
      this.generatedUntilX += 260;
    }
  }

  update(cameraX) {
    const needUntil = cameraX + this.spawnAhead;

    while (this.generatedUntilX < needUntil) {
      this.generateChunk();
    }

    const killX = cameraX - this.cleanupPadding;

    this.platforms.getChildren().forEach((p) => {
      if (p.x + p.displayWidth / 2 < killX) p.destroy();
    });

    this.items.getChildren().forEach((it) => {
      if (it.x + it.displayWidth / 2 < killX) it.destroy();
    });

    this.boxes.getChildren().forEach((b) => {
      if (b.x + b.displayWidth / 2 < killX) {
        destroyBox(b);
        return;
      }

      const view = b.getData?.('view');
      if (view) {
        view.x = b.x;
        view.y = b.y;
      }
    });

    if (this.rocks) {
      this.rocks.getChildren().forEach((r) => {
        if (r.x + r.displayWidth / 2 < killX) r.destroy();
      });
    }
  }

  generateChunk() {
    const gap = Phaser.Math.Between(90, 170);
    const width = Phaser.Math.Between(160, 360);

    const dy = Phaser.Math.Between(-70, 70);
    this.lastY = Phaser.Math.Clamp(this.lastY + dy, 260, 460);

    const x = this.generatedUntilX + gap;
    const cx = x + width / 2;

    this.spawnPlatform(cx, this.lastY, width);

    const topY = this.lastY - this.platformH / 2;

    if (Math.random() < 0.25) {
      this.spawnBox(cx + Phaser.Math.Between(-60, 60), topY - 17);
    }

    if (Math.random() < 0.35) {
      this.spawnToken(cx, topY - 60);
    }

    if (this.canSpawnRock(cx) && Math.random() < this.rockChance) {
      this.spawnRock(cx + Phaser.Math.Between(-40, 40), topY - this.rockR);
      this.lastRockX = cx;
    }

    this.generatedUntilX = x + width;
  }

  canSpawnRock(x) {
    return x - this.lastRockX >= this.rockMinGap;
  }

  spawnPlatform(cx, y, w) {
    const p = this.scene.add.rectangle(cx, y, w, this.platformH, 0x3d3d3d);
    this.scene.physics.add.existing(p, true);
    this.platforms.add(p);
  }

  spawnToken(x, y) {
    const t = this.scene.add.rectangle(x, y, 18, 18, 0xffd34a);
    this.scene.physics.add.existing(t, true);

    t.setDataEnabled();
    t.setData('type', 'coin');

    this.items.add(t);
  }

  spawnBox(x, y) {
    const b = this.scene.add.rectangle(x, y, this.boxW, this.boxH, 0x000000, 0);
    this.scene.physics.add.existing(b);

    const body = b.body;
    body.setBounce(0);
    body.setDragX(600);
    body.setMaxVelocity(500, 900);
    body.setCollideWorldBounds(false);

    const view = this.scene.add.image(x, y, this.boxTexKey);
    view.setOrigin(0.5, 0.5);
    view.setDisplaySize(this.boxW, this.boxH);

    b.setDataEnabled();
    b.setData('view', view);

    this.boxes.add(b);
  }

  spawnRock(x, y) {
    if (!this.rocks) return;

    const r = this.scene.add.circle(x, y, this.rockR, 0x8a8f98);
    this.scene.physics.add.existing(r, true);

    r.body.setCircle(this.rockR);
    r.body.setOffset(0, 0);

    this.rocks.add(r);
  }
}
