// src/scenes/GameScene.js
import Phaser from 'phaser';
import { LevelStream } from '../systems/LevelStream.js';
import { createControls } from '../input/createControls.js';
import { createHud } from '../ui/createHud.js';
import { createBoxCarrySystem } from '../systems/boxCarrySystem.js';
import { createCameraFollow } from '../systems/cameraFollow.js';
import { createPlayerMovement } from '../systems/playerMovement.js';
import { createPlayerJump } from '../systems/playerJump.js';
import { createRespawnSystem } from '../systems/respawnSystem.js';
import { setupColliders } from '../systems/setupColliders.js';
import { createPlayerView } from '../entities/playerView.js';

import { spawnStalactite } from '../entities/spawnStalactite.js';
import { spawnPickaxe } from '../entities/spawnPickaxe.js';
import { spawnHeart } from '../entities/spawnHeart.js';

import { createParallaxStack } from '../systems/createParallaxBg.js';

import {
  PLAYER_SPAWN,
  STAL,
  BREAK,
  ASSETS,
  PARALLAX,
} from './gameScene.constants.js';
import { createRespawnBox, getNearestBoxInFront } from './gameScene.helpers.js';
import { spawnCoinFromBox } from '../entities/spawnCoinFromBox.js';
import { bindPickaxeBreak } from './gameScene.bindings.js';
import { destroyBoxWithExplosion } from '../entities/spawnExplosion.js';

import { spawnIdlePlayer } from '../entities/spawnIdlePlayer.js';

export default class GameScene extends Phaser.Scene {
  preload() {
    const baseUrl =
      typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
        ? import.meta.env.BASE_URL
        : '/';

    this.load.setBaseURL(baseUrl);

    Object.values(ASSETS).forEach((group) => {
      Object.values(group).forEach((asset) => {
        const { KEY, SRC, FRAME_WIDTH, FRAME_HEIGHT } = asset;

        if (this.textures.exists(KEY)) return;

        if (FRAME_WIDTH && FRAME_HEIGHT) {
          this.load.spritesheet(KEY, SRC, {
            frameWidth: FRAME_WIDTH,
            frameHeight: FRAME_HEIGHT,
          });
          return;
        }

        this.load.image(KEY, SRC);
      });
    });
  }

  create() {
    const { height } = this.scale;
    this.physics.world.setBounds(0, 0, 999999, height);

    if (!this.anims.exists('coin-spin') && ASSETS.ITEMS?.COIN) {
      const coin = ASSETS.ITEMS.COIN;

      this.anims.create({
        key: 'coin-spin',
        frames: this.anims.generateFrameNumbers(coin.KEY, {
          start: 0,
          end: (coin.FRAMES ?? 8) - 1,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }

    const parallax = createParallaxStack(this, [
      {
        key: ASSETS.BACKGROUND.CAVE_BACK.KEY,
        factor: PARALLAX.CAVE_BACK.FACTOR,
        depth: PARALLAX.CAVE_BACK.DEPTH,
      },
      {
        key: ASSETS.BACKGROUND.CAVE.KEY,
        factor: PARALLAX.CAVE.FACTOR,
        depth: PARALLAX.CAVE.DEPTH,
      },
    ]);

    this.events.once('shutdown', () => parallax.destroy());
    this.events.once('destroy', () => parallax.destroy());

    const groups = {
      platforms: this.physics.add.staticGroup(),
      items: this.physics.add.staticGroup(),
      boxes: this.physics.add.group(),
      rocks: this.physics.add.staticGroup(),
    };

    const player = spawnIdlePlayer(this, PLAYER_SPAWN.x, PLAYER_SPAWN.y);
    player.setDataEnabled();
    if (player.getData('facing') == null) player.setData('facing', 1);

    const controls = createControls(this);
    const hud = createHud(this);
    player.setData('hasPickaxe', hud.hasPickaxe());
    player.setData('isCarrying', false);
    player.updateView?.();

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

    const onPlayerDeath = () => {
      hud.setPickaxeDurability(0);
      player.setData('hasPickaxe', false);
      player.setData('isCarrying', false);
      boxCarry?.reset?.();
      player.updateView?.();
    };

    const respawn = createRespawnSystem(
      player,
      cameraFollow,
      boxCarry,
      groups.platforms,
      { onDeath: onPlayerDeath }
    );

    setupColliders(this, {
      player,
      platforms: groups.platforms,
      boxes: groups.boxes,
      rocks: groups.rocks,
      boxCarry,
      items: groups.items,
      hud,
    });

    const respawnBox = createRespawnBox();

    const spawnStal = () => {
      const x = player.x + Phaser.Math.Between(STAL.MIN_AHEAD, STAL.MAX_AHEAD);

      spawnStalactite(this, {
        x,
        y: STAL.Y,
        speedY: STAL.SPEED_Y,
        respawnOffset: STAL.RESPAWN_OFFSET,
        boxes: groups.boxes,
        player,
        spawnPickaxe: (scene, pos) =>
          spawnPickaxe(scene, { ...pos, group: groups.items }),
        spawnHeart: (scene, pos) =>
          spawnHeart(scene, { ...pos, group: groups.items }),
        respawnBox,
        respawnSystem: respawn,
      });
    };

    spawnStal();
    this.time.addEvent({
      delay: STAL.SPAWN_EVERY,
      loop: true,
      callback: spawnStal,
    });

    const playerView = createPlayerView(this, player);

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
    this._parallax = parallax;

    bindPickaxeBreak(this, {
      player,
      hud,
      playerView,
      tryBreakBox: () => this.tryBreakBox(),
    });
  }

  tryBreakBox() {
    if (!this._hud.hasPickaxe()) return;
    if (this._boxCarry?.isCarrying?.()) return;

    const box = getNearestBoxInFront(this._player, this._g.boxes, {
      dist: BREAK.DIST,
      dy: BREAK.DY,
    });
    if (!box) return;

    const used = this._hud.usePickaxe();
    if (!used) return;

    this._player.setData('hasPickaxe', this._hud.hasPickaxe());
    this._player.updateView?.();

    spawnCoinFromBox(this, this._g.items, this._player, box, BREAK);
    destroyBoxWithExplosion(this, box);
  }

  update() {
    this._parallax?.update?.();

    this._playerMovement.update();
    this._playerJump.update();
    this._boxCarry.update();

    const vx = this._player?.body?.velocity?.x ?? 0;
    const prevFacing = this._player.getData('facing') || 1;

    if (vx < -1) this._player.setData('facing', -1);
    else if (vx > 1) this._player.setData('facing', 1);
    else this._player.setData('facing', prevFacing);

    this._player?.updateView?.();
    this._playerView?.update?.();

    const scrollX = this._cameraFollow.update(this._player.x, this.scale.width);
    this._stream.update(scrollX);
    this._respawn.update();
  }
}
