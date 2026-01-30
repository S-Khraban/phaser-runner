export function createParallaxBg(
  scene,
  { key, factor = 0.7, depth = -1000 } = {}
) {
  const cam = scene.cameras.main;

  const imgA = scene.add.image(0, 0, key).setOrigin(0, 0.5);
  const imgB = scene.add.image(0, 0, key).setOrigin(0, 0.5);

  imgA.setScrollFactor(0).setDepth(depth);
  imgB.setScrollFactor(0).setDepth(depth);

  const mod2 = (n) => ((n % 2) + 2) % 2;

  function resize() {
    const h = scene.scale.height;
    const cy = h / 2;

    imgA.y = cy;
    imgB.y = cy;
  }

  function update() {
    const w = imgA.displayWidth;
    if (!w) return;

    const worldX = cam.scrollX * factor;

    const seg = Math.floor(worldX / w);
    const offset = -(worldX - seg * w);

    const x0 = Math.round(offset);

    imgA.x = x0;
    imgB.x = x0 + w;

    imgA.setFlipX(mod2(seg) === 1);
    imgB.setFlipX(mod2(seg + 1) === 1);
  }

  resize();
  scene.scale.on('resize', resize);

  return {
    update,
    resize,
    destroy() {
      scene.scale.off('resize', resize);
      imgA.destroy();
      imgB.destroy();
    },
  };
}

export function createParallaxStack(scene, layers = []) {
  const list = layers
    .filter(Boolean)
    .map((cfg) => createParallaxBg(scene, cfg));

  return {
    update() {
      for (const p of list) p.update();
    },
    resize() {
      for (const p of list) p.resize?.();
    },
    destroy() {
      for (const p of list) p.destroy?.();
    },
  };
}
