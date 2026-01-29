import Phaser from 'phaser';

export class LevelStream {
  constructor(scene, platforms) {
    this.scene = scene;
    this.platforms = platforms;

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
  }

  generateChunk() {
    const gap = Phaser.Math.Between(90, 170);
    const width = Phaser.Math.Between(160, 360);

    const dy = Phaser.Math.Between(-70, 70);
    this.lastY = Phaser.Math.Clamp(this.lastY + dy, 260, 460);

    const x = this.generatedUntilX + gap;
    this.spawnPlatform(x + width / 2, this.lastY, width);

    this.generatedUntilX = x + width;
  }

  spawnPlatform(cx, y, w) {
    const p = this.scene.add.rectangle(cx, y, w, 26, 0x3d3d3d);
    this.scene.physics.add.existing(p, true);
    this.platforms.add(p);
  }
}
