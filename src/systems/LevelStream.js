import Phaser from 'phaser';

export class LevelStream {
  constructor(scene, platforms, items) {
    this.scene = scene;
    this.platforms = platforms;
    this.items = items;

    this.generatedUntilX = 0;
    this.cleanupPadding = 500;
    this.spawnAhead = 1600;

    this.lastY = 420;
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
  }

  generateChunk() {
    const gap = Phaser.Math.Between(90, 170);
    const width = Phaser.Math.Between(160, 360);

    const dy = Phaser.Math.Between(-70, 70);
    this.lastY = Phaser.Math.Clamp(this.lastY + dy, 260, 460);

    const x = this.generatedUntilX + gap;
    const cx = x + width / 2;

    this.spawnPlatform(cx, this.lastY, width);

    if (Math.random() < 0.55) {
      this.spawnToken(cx, this.lastY - 60);
    }

    this.generatedUntilX = x + width;
  }

  spawnPlatform(cx, y, w) {
    const p = this.scene.add.rectangle(cx, y, w, 26, 0x3d3d3d);
    this.scene.physics.add.existing(p, true);
    this.platforms.add(p);
  }

  spawnToken(x, y) {
    const t = this.scene.add.rectangle(x, y, 18, 18, 0xffd34a);
    this.scene.physics.add.existing(t, true);
    this.items.add(t);
  }
}
