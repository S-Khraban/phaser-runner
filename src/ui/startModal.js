import Phaser from 'phaser';
import { START_MODAL } from './startModal.styles.js';

export function createStartModal(scene, opts = {}) {
  const cfg = START_MODAL;

  const width = opts.width ?? cfg.layout.width;
  const padding = opts.padding ?? cfg.layout.padding;
  const onStart = opts.onStart ?? (() => {});
  const onResume = opts.onResume ?? (() => {});

  const { width: sw, height: sh } = scene.scale;

  const container = scene.add.container(sw / 2, sh / 2);
  container.setDepth(cfg.depth);
  container.setScrollFactor(0);

  const dim = scene.add.rectangle(0, 0, sw, sh, cfg.colors.dim, cfg.alpha.dim);
  dim.setOrigin(0.5);
  dim.setInteractive();

  const maxPanelH = Math.floor(sh * cfg.layout.panelHFactor);
  const panelH = Math.min(cfg.layout.panelMaxH, maxPanelH);

  const panel = scene.add.rectangle(
    0,
    0,
    width,
    panelH,
    cfg.colors.panel,
    cfg.alpha.panel
  );
  panel.setOrigin(0.5);
  panel.setStrokeStyle(2, cfg.colors.white, cfg.alpha.stroke);

  const title = scene.add.text(
    0,
    -panelH / 2 + padding,
    'START',
    cfg.text.title
  );
  title.setOrigin(0.5, 0);

  const rulesText = [
    '🎮 Rules:',
    '• 🏃‍♂️ Run forward, dodge hazards, and grab coins 🪙',
    '• ⛏️ Pickaxe helps you break boxes 📦 (only if you have it)',
    '• 💥 Each hit reduces tool durability 🔧',
    '• ⚠️ When durability reaches 0, you lose the pickaxe ❌⛏️',
  ].join('\n');

  const stalText = [
    '🧊 Stalactite trick:',
    '• 📦 Throw a box into a stalactite to smash it 💥',
    '• 🎁 This can drop an extra life ❤️ or a pickaxe ⛏️',
  ].join('\n');

  const controlsText = [
    '🕹️ Controls:',
    '• A⬅️ / D➡️ — move',
    '• W⬆️  — jump',
    '• SPACE — pick up / drop box 📦',
    '• SPACE⛏️ Pickaxe — kick / break boxes 💥',
  ].join('\n');

  const topY = -panelH / 2 + padding + cfg.layout.topOffset;

  const rules = scene.add.text(0, topY, rulesText, {
    ...cfg.text.body,
    align: 'left',
    wordWrap: { width: width - padding * 2 },
  });
  rules.setOrigin(0.5, 0);

  const colsTop = topY + rules.height + cfg.layout.gapAfterRules;

  const colW = Math.floor((width - padding * 3) / 2);
  const leftX = -width / 2 + padding;
  const rightX = leftX + colW + padding;

  const stal = scene.add.text(leftX, colsTop, stalText, {
    ...cfg.text.body,
    wordWrap: { width: colW },
  });
  stal.setOrigin(0, 0);

  const controls = scene.add.text(rightX, colsTop, controlsText, {
    ...cfg.text.body,
    wordWrap: { width: colW },
  });
  controls.setOrigin(0, 0);

  const btnW = cfg.button.w;
  const btnH = cfg.button.h;

  const restartBtn = scene.add.rectangle(
    0,
    panelH / 2 - padding - btnH / 2,
    btnW,
    btnH,
    cfg.colors.button,
    1
  );
  restartBtn.setOrigin(0.5);
  restartBtn.setStrokeStyle(2, cfg.colors.white, cfg.alpha.btnStroke);
  restartBtn.setInteractive({ useHandCursor: true });

  const restartLabel = scene.add.text(0, restartBtn.y, 'START', cfg.text.button);
  restartLabel.setOrigin(0.5);

  const resumeBtn = scene.add.rectangle(
    0,
    restartBtn.y,
    btnW,
    btnH,
    cfg.colors.buttonHover,
    1
  );
  resumeBtn.setOrigin(0.5);
  resumeBtn.setStrokeStyle(2, cfg.colors.white, cfg.alpha.btnStroke);
  resumeBtn.setInteractive({ useHandCursor: true });

  const resumeLabel = scene.add.text(0, resumeBtn.y, 'RESUME', cfg.text.button);
  resumeLabel.setOrigin(0.5);

  function setHover(btn, isHover) {
    if (btn === restartBtn) {
      restartBtn.setFillStyle(
        isHover ? cfg.colors.buttonHover : cfg.colors.button,
        1
      );
    }
    if (btn === resumeBtn) {
      resumeBtn.setFillStyle(
        isHover ? cfg.colors.button : cfg.colors.buttonHover,
        1
      );
    }
  }

  restartBtn.on('pointerover', () => setHover(restartBtn, true));
  restartBtn.on('pointerout', () => setHover(restartBtn, false));
  restartBtn.on('pointerdown', () => {
    hide();
    onStart();
  });

  resumeBtn.on('pointerover', () => setHover(resumeBtn, true));
  resumeBtn.on('pointerout', () => setHover(resumeBtn, false));
  resumeBtn.on('pointerdown', () => {
    hide();
    onResume();
  });

  function layoutButtons(mode) {
    const y = panelH / 2 - padding - btnH / 2;

    if (mode === 'pause') {
      restartBtn.setVisible(true);
      restartLabel.setVisible(true);
      resumeBtn.setVisible(true);
      resumeLabel.setVisible(true);

      restartBtn.setPosition(-btnW / 2 - 10, y);
      restartLabel.setPosition(-btnW / 2 - 10, y);

      resumeBtn.setPosition(btnW / 2 + 10, y);
      resumeLabel.setPosition(btnW / 2 + 10, y);
      return;
    }

    restartBtn.setVisible(true);
    restartLabel.setVisible(true);
    resumeBtn.setVisible(false);
    resumeLabel.setVisible(false);

    restartBtn.setPosition(0, y);
    restartLabel.setPosition(0, y);
  }

  function show(mode = 'start') {
    container.setVisible(true);
    container.setActive(true);

    if (mode === 'gameover') {
      title.setText('GAME OVER');
      restartLabel.setText('START AGAIN');
      layoutButtons('gameover');
      return;
    }

    if (mode === 'pause') {
      title.setText('PAUSED');
      restartLabel.setText('RESTART');
      resumeLabel.setText('RESUME');
      layoutButtons('pause');
      return;
    }

    title.setText('START');
    restartLabel.setText('START');
    layoutButtons('start');
  }

  function hide() {
    container.setVisible(false);
    container.setActive(false);
  }

  container.add([
    dim,
    panel,
    title,
    rules,
    stal,
    controls,
    restartBtn,
    restartLabel,
    resumeBtn,
    resumeLabel,
  ]);

  function onResize(gameSize) {
    const { width: nw, height: nh } = gameSize;
    container.setPosition(nw / 2, nh / 2);
    dim.setSize(nw, nh);
  }

  scene.scale.on('resize', onResize);

  container.once(Phaser.GameObjects.Events.DESTROY, () => {
    scene.scale.off('resize', onResize);
  });

  return {
    show,
    hide,
    destroy: () => container.destroy(true),
  };
}
