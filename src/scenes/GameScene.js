import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  create() {
    const { width, height } = this.scale;

    const text = this.add.text(width / 2, height / 2, 'Phaser is running ✅', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
      fontSize: '32px',
      color: '#ffffff',
    });

    text.setOrigin(0.5);

    this.add.rectangle(width / 2, height / 2 + 70, 320, 8, 0x4aa3ff).setOrigin(
      0.5
    );
  }
}
