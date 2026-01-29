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

import { spawnStalactite } from '../entities/spawnStalactite.js';
import { spawnPickaxe } from '../entities/spawnPickaxe.js';
import { spawnHeart } from '../entities/spawnHeart.js';

const PLAYER_SPAWN = { x: 120, y: 200 };

const STAL = {
  SPAWN_EVERY: 6500,
  MIN_AHEAD: 360,
  MAX_AHEAD: 760,
  Y: -60,
  SPEED_Y: 180,
  RESPAWN_DELAY: 2200,
  RESPAWN_OFFSET: 50,
};

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

    const player = createPlayer(this, PLAYER_SPAWN);

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

    const respawnPlayer = (p) => {
      p.setPosition(PLAYER_SPAWN.x, PLAYER_SPAWN.y);
      p.setActive(true);
      p.setVisible(true);

      if (p.body) {
        p.body.enable = true;
        p.body.setVelocity(0, 0);
      }
    };

    const respawnBox = (box) => {
      if (!box) return;

      if (box.getData('spawnX') == null) box.setData('spawnX', box.x);
      if (box.getData('spawnY') == null) box.setData('spawnY', box.y);

      const bx = box.getData('spawnX');
      const by = box.getData('spawnY');

      if (box.disableBody && box.enableBody) {
        box.enableBody(true, bx, by, true, true);
      } else {
        box.setPosition(bx, by);
        box.setActive?.(true);
        box.setVisible?.(true);
        if (box.body) box.body.enable = true;
      }

      if (box.body) {
        box.body.setVelocity(0, 0);
        box.body.allowGravity = true;
      }
    };

    const spawnStal = () => {
      const x = player.x + Phaser.Math.Between(STAL.MIN_AHEAD, STAL.MAX_AHEAD);

      spawnStalactite(this, {
        x,
        y: STAL.Y,
        speedY: STAL.SPEED_Y,
        respawnOffset: STAL.RESPAWN_OFFSET,
        boxes: groups.boxes,
        player,
        respawnDelay: STAL.RESPAWN_DELAY,
        spawnPickaxe: (scene, pos) =>
          spawnPickaxe(scene, { ...pos, group: groups.items }),
        spawnHeart: (scene, pos) =>
          spawnHeart(scene, { ...pos, group: groups.items }),
        respawnBox,
        respawnPlayer,
      });
    };

    spawnStal();

    this.time.addEvent({
      delay: STAL.SPAWN_EVERY,
      loop: true,
      callback: spawnStal,
    });

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
