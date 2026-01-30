import { spawnCoin } from '../entities/spawnCoin.js';
import { destroyBoxWithExplosion } from '../entities/spawnExplosion.js';

export function setupColliders(
  scene,
  { player, platforms, boxes, rocks, boxCarry, items, hud, respawn, stals }
) {
  scene.physics.add.collider(player, platforms);
  scene.physics.add.collider(boxes, platforms);
  scene.physics.add.collider(player, rocks);

  scene.physics.add.overlap(
    player,
    boxes,
    (_p, box) => boxCarry.onPlayerBoxOverlap(_p, box),
    undefined,
    scene
  );

  scene.physics.add.overlap(
    player,
    items,
    (_p, _it) => {
      if (!hud) return;

      const it = _it?.gameObject ?? _it;
      if (!it?.active) return;
      if (it.__picked) return;

      it.__picked = true;
      if (it.body) it.body.enable = false;

      const type =
        it.getData?.('type') ??
        it.getData?.('kind') ??
        it.getData?.('itemType') ??
        it.name ??
        it.texture?.key ??
        '';

      const t = String(type).toLowerCase();

      if (t.includes('heart')) {
        scene._sfx?.coin?.();
        hud.addHeart();
        it.destroy?.();
        return;
      }

      if (t.includes('pickaxe') || t.includes('axe')) {
        scene._sfx?.coin?.();
        hud.addPickaxe();
        _p?.setData?.('hasPickaxe', hud.hasPickaxe());
        it.destroy?.();
        return;
      }

      if (t.includes('coin') || t.includes('token')) {
        scene._sfx?.coin?.();
        hud.addToken();
        it.destroy?.();
        return;
      }

      it.__picked = false;
      if (it.body) it.body.enable = true;
    },
    undefined,
    scene
  );

  scene.physics.add.overlap(
    boxes,
    rocks,
    (_b, _r) => {
      const box = _b?.gameObject ?? _b;
      if (!box?.body || !box.body.enable) return;

      if (box === boxCarry.getCarriedBox()) return;
      if (box.__hitRock) return;

      box.__hitRock = true;

      scene._sfx?.boom?.();
      spawnCoin(scene, items, box.x, box.y - 24);
      destroyBoxWithExplosion(scene, box);

      scene.time.delayedCall(0, () => {
        if (box && box.body) delete box.__hitRock;
      });
    },
    undefined,
    scene
  );

  if (respawn?.kill && stals) {
    scene.physics.add.overlap(
      player,
      stals,
      (_p, _s) => {
        const p = _p?.gameObject ?? _p;
        if (!p?.active) return;
        if (p.getData?.('dead')) return;

        scene._sfx?.boom?.();
        respawn.kill({
          cause: 'stalactite',
          x: p.x,
          y: p.y,
        });
      },
      undefined,
      scene
    );
  }
}
