import Phaser from 'phaser';
import { LevelStream } from '../systems/LevelStream.js';
import { createControls } from '../input/createControls.js';
import { createPlayer } from '../entities/createPlayer.js';
import { createHud } from '../ui/createHud.js';
import { createBoxCarrySystem } from '../systems/boxCarrySystem.js';
import { createCameraFollow } from '../systems/cameraFollow.js';
import { createPlayerMovement } from '../systems/playerMovement.js';
import { createPlayerJump } from '../systems/playerJump.js';
import { createRespawnSystem } from '../systems/respawnSystem.js';
import { setupColliders } from '../systems/setupColliders.js';
import { setupTokenSystem } from '../systems/tokenSystem.js';

export default class GameScene extends Phaser.Scene {
  create() {
    const { height } = this.scale;

    this.physics.world.setBounds(0, 0, 999999, height);

    const groups = {
      platforms: this.physics.add.staticGroup(),
      items: this.physics.add.staticGroup(),
      boxes: this.physics.add.group(),
      rocks: this.physics.add.staticGroup(),
    };

    const player = createPlayer(this, { x: 120, y: 200 });

    const controls = createControls(this);
    const hud = createHud(this);

    const stream = new LevelStream(
      this,
      groups.platforms,
      groups.items,
      groups.boxes,
      groups.rocks
    );
    stream.init(0);

    const cameraFollow = createCameraFollow(this, { height });
    const playerMovement = createPlayerMovement(player, controls);
    const playerJump = createPlayerJump(player, controls);

    const boxCarry = createBoxCarrySystem(this, {
      player,
      boxes: groups.boxes,
      controls,
    });

    setupColliders(this, {
      player,
      platforms: groups.platforms,
      boxes: groups.boxes,
      rocks: groups.rocks,
      boxCarry,
      items: groups.items,
    });

    setupTokenSystem(this, {
      player,
      items: groups.items,
      hud,
    });

    const respawn = createRespawnSystem(player, cameraFollow);

    this._g = groups;
    this._player = player;
    this._controls = controls;
    this._hud = hud;
    this._stream = stream;

    this._cameraFollow = cameraFollow;
    this._playerMovement = playerMovement;
    this._playerJump = playerJump;
    this._boxCarry = boxCarry;
    this._respawn = respawn;
  }

  update() {
    this._playerMovement.update();
    this._playerJump.update();
    this._boxCarry.update();

    const scrollX = this._cameraFollow.update(this._player.x, this.scale.width);

    this._stream.update(scrollX);
    this._respawn.update();
  }
}
