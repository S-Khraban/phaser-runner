import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#0b1020',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: false,
    },
  },
  scene: [GameScene],
};

new Phaser.Game(config);
