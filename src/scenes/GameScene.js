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
import { createPlayerView } from '../entities/playerView.js';

import { spawnStalactite } from '../entities/spawnStalactite.js';
import { spawnPickaxe } from '../entities/spawnPickaxe.js';
import { spawnHeart } from '../entities/spawnHeart.js';
import { spawnCoin } from '../entities/spawnCoin.js';

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

const BREAK = {
  DIST: 70,
  DY: 60,
  COIN_MIN: 30,
  COIN_MAX: 50,
  COIN_Y: -10,
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
    player.setDataEnabled();
    if (player.getData('hasPickaxe') == null) {
      player.setData('hasPickaxe', true);
    }
    if (player.getData('facing') == null) {
      player.setData('facing', 1);
    }

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

    const respawn = createRespawnSystem(
  player,
  cameraFollow,
  boxCarry,
  groups.platforms
);


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

    const onPlayerDeath = () => {
      player.setData('hasPickaxe', false);
      boxCarry?.drop?.();
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
        onPlayerDeath,
      });
    };

    spawnStal();

    this.time.addEvent({
      delay: STAL.SPAWN_EVERY,
      loop: true,
      callback: spawnStal,
    });

    const playerView = createPlayerView(this, player);

    this.input.keyboard.on('keydown-SPACE', () => {
      if (!player.active || !player.visible) return;
      if (!player.getData('hasPickaxe')) return;

      playerView.swingPickaxe();
      this.tryBreakBox();
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
    this._playerView = playerView;
  }

  isInFront(target) {
    const facing = this._player.getData('facing') || 1;
    return (target.x - this._player.x) * facing > 0;
  }

  getNearestBoxInFront() {
    let best = null;
    let bestDist = BREAK.DIST;

    for (const raw of this._g.boxes.getChildren()) {
      const box = raw && raw.gameObject ? raw.gameObject : raw;
      if (!box?.active) continue;

      const dx = box.x - this._player.x;
      const dy = Math.abs(box.y - this._player.y);

      if (dy > BREAK.DY) continue;
      if (!this.isInFront(box)) continue;

      const dist = Math.abs(dx);
      if (dist <= bestDist) {
        bestDist = dist;
        best = box;
      }
    }

    return best;
  }

  spawnCoinFromBox(box) {
    const facing = this._player.getData('facing') || 1;
    const offset = Phaser.Math.Between(BREAK.COIN_MIN, BREAK.COIN_MAX);

    const x = box.x + facing * offset;
    const y = box.y + BREAK.COIN_Y;

    spawnCoin(this, this._g.items, x, y);
  }

  tryBreakBox() {
    if (!this._player.getData('hasPickaxe')) return;
    if (this._boxCarry?.isCarrying?.()) return;

    const box = this.getNearestBoxInFront();
    if (!box) return;

    this.spawnCoinFromBox(box);
    box.destroy?.();
  }

  update() {
    this._playerMovement.update();
    this._playerJump.update();
    this._boxCarry.update();

    const vx = this._player?.body?.velocity?.x ?? 0;
    const prevFacing = this._player.getData('facing') || 1;

    if (vx < -1) this._player.setData('facing', -1);
    else if (vx > 1) this._player.setData('facing', 1);
    else this._player.setData('facing', prevFacing);

    this._playerView?.update?.();

    const scrollX = this._cameraFollow.update(this._player.x, this.scale.width);

    this._stream.update(scrollX);
    this._respawn.update();
  }
}
