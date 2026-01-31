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
  dim.setScrollFactor(0);
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
  panel.setScrollFactor(0);

  const title = scene.add.text(
    0,
    -panelH / 2 + padding,
    'START',
    cfg.text.title
  );
  title.setOrigin(0.5, 0);
  title.setScrollFactor(0);

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
    '•  🔊🔇— mute| unmute',
  ].join('\n');

  const topY = -panelH / 2 + padding + cfg.layout.topOffset;

  const rules = scene.add.text(0, topY, rulesText, {
    ...cfg.text.body,
    align: 'left',
    wordWrap: { width: width - padding * 2 },
  });
  rules.setOrigin(0.5, 0);
  rules.setScrollFactor(0);

  const colsTop = topY + rules.height + cfg.layout.gapAfterRules;

  const colW = Math.floor((width - padding * 3) / 2);
  const leftX = -width / 2 + padding;
  const rightX = leftX + colW + padding;

  const stal = scene.add.text(leftX, colsTop, stalText, {
    ...cfg.text.body,
    wordWrap: { width: colW },
  });
  stal.setOrigin(0, 0);
  stal.setScrollFactor(0);

  const controls = scene.add.text(rightX, colsTop, controlsText, {
    ...cfg.text.body,
    wordWrap: { width: colW },
  });
  controls.setOrigin(0, 0);
  controls.setScrollFactor(0);

  const btnW = cfg.button.w;
  const btnH = cfg.button.h;
  const btnY = panelH / 2 - padding - btnH / 2;

  const restartBtn = scene.add.rectangle(0, btnY, btnW, btnH, cfg.colors.button, 1);
  restartBtn.setOrigin(0.5);
  restartBtn.setStrokeStyle(2, cfg.colors.white, cfg.alpha.btnStroke);
  restartBtn.setScrollFactor(0);

  const restartLabel = scene.add.text(0, btnY, 'START', cfg.text.button);
  restartLabel.setOrigin(0.5);
  restartLabel.setScrollFactor(0);

  const resumeBtn = scene.add.rectangle(0, btnY, btnW, btnH, cfg.colors.buttonHover, 1);
  resumeBtn.setOrigin(0.5);
  resumeBtn.setStrokeStyle(2, cfg.colors.white, cfg.alpha.btnStroke);
  resumeBtn.setScrollFactor(0);

  const resumeLabel = scene.add.text(0, btnY, 'RESUME', cfg.text.button);
  resumeLabel.setOrigin(0.5);
  resumeLabel.setScrollFactor(0);

  const scoreText = scene.add.text(0, 0, '', cfg.text.score ?? cfg.text.body);
  scoreText.setOrigin(0.5, 0);
  scoreText.setScrollFactor(0);

  function setScore(value) {
    const v = Number.isFinite(value) ? value : 0;
    scoreText.setText(`🪙 Coins collected: ${v}`);
  }

  function setButtonHover(btn, isHover) {
    if (btn === restartBtn) {
      restartBtn.setFillStyle(isHover ? cfg.colors.buttonHover : cfg.colors.button, 1);
      return;
    }
    resumeBtn.setFillStyle(isHover ? cfg.colors.button : cfg.colors.buttonHover, 1);
  }

  function clickRestart() {
    hide();
    onStart();
  }

  function clickResume() {
    hide();
    onResume();
  }

  restartBtn.setInteractive({ useHandCursor: true });
  restartLabel.setInteractive({ useHandCursor: true });
  resumeBtn.setInteractive({ useHandCursor: true });
  resumeLabel.setInteractive({ useHandCursor: true });

  restartBtn.on('pointerover', () => setButtonHover(restartBtn, true));
  restartBtn.on('pointerout', () => setButtonHover(restartBtn, false));
  restartBtn.on('pointerdown', clickRestart);

  restartLabel.on('pointerover', () => setButtonHover(restartBtn, true));
  restartLabel.on('pointerout', () => setButtonHover(restartBtn, false));
  restartLabel.on('pointerdown', clickRestart);

  resumeBtn.on('pointerover', () => setButtonHover(resumeBtn, true));
  resumeBtn.on('pointerout', () => setButtonHover(resumeBtn, false));
  resumeBtn.on('pointerdown', clickResume);

  resumeLabel.on('pointerover', () => setButtonHover(resumeBtn, true));
  resumeLabel.on('pointerout', () => setButtonHover(resumeBtn, false));
  resumeLabel.on('pointerdown', clickResume);

  function layoutButtons(mode) {
    const gap = cfg.button?.gap ?? 20;

    if (mode === 'pause') {
      restartBtn.setVisible(true);
      restartLabel.setVisible(true);
      resumeBtn.setVisible(true);
      resumeLabel.setVisible(true);

      restartBtn.setPosition(-(btnW / 2 + gap / 2), btnY);
      restartLabel.setPosition(-(btnW / 2 + gap / 2), btnY);

      resumeBtn.setPosition(btnW / 2 + gap / 2, btnY);
      resumeLabel.setPosition(btnW / 2 + gap / 2, btnY);
      return;
    }

    restartBtn.setVisible(true);
    restartLabel.setVisible(true);
    resumeBtn.setVisible(false);
    resumeLabel.setVisible(false);

    restartBtn.setPosition(0, btnY);
    restartLabel.setPosition(0, btnY);
  }

  function layoutScore(mode) {
    const offset = cfg.layout?.scoreOffsetFromButtons ?? 18;
    const y = btnY - btnH / 2 - offset;

    if (mode === 'pause' || mode === 'gameover') {
      scoreText.setVisible(true);
      scoreText.setPosition(0, y);
      return;
    }

    scoreText.setVisible(false);
  }

  function show(mode = 'start', meta = {}) {
    container.setVisible(true);
    container.setActive(true);

    const score = meta?.score ?? meta?.tokens ?? meta?.coins;
    setScore(score);

    if (mode === 'gameover') {
      title.setText('GAME OVER');
      restartLabel.setText('START AGAIN');
      layoutButtons('gameover');
      layoutScore('gameover');
      return;
    }

    if (mode === 'pause') {
      title.setText('PAUSED');
      restartLabel.setText('RESTART');
      resumeLabel.setText('RESUME');
      layoutButtons('pause');
      layoutScore('pause');
      return;
    }

    title.setText('START');
    restartLabel.setText('START');
    layoutButtons('start');
    layoutScore('start');
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
    scoreText,
    restartBtn,
    restartLabel,
    resumeBtn,
    resumeLabel,
  ]);

  function onResize(gameSize) {
    const { width: nw, height: nh } = gameSize;

    container.setPosition(nw / 2, nh / 2);
    dim.setSize(nw, nh);

    const maxH = Math.floor(nh * cfg.layout.panelHFactor);
    const nextPanelH = Math.min(cfg.layout.panelMaxH, maxH);
    panel.setSize(width, nextPanelH);

    title.setPosition(0, -nextPanelH / 2 + padding);

    const nextTopY = -nextPanelH / 2 + padding + cfg.layout.topOffset;
    rules.setPosition(0, nextTopY);

    const nextColsTop = nextTopY + rules.height + cfg.layout.gapAfterRules;
    stal.setPosition(leftX, nextColsTop);
    controls.setPosition(rightX, nextColsTop);

    const nextBtnY = nextPanelH / 2 - padding - btnH / 2;
    restartBtn.setY(nextBtnY);
    restartLabel.setY(nextBtnY);
    resumeBtn.setY(nextBtnY);
    resumeLabel.setY(nextBtnY);
    scoreText.setY(nextBtnY - btnH / 2 - (cfg.layout?.scoreOffsetFromButtons ?? 18));
  }

  scene.scale.on('resize', onResize);

  container.once(Phaser.GameObjects.Events.DESTROY, () => {
    scene.scale.off('resize', onResize);
  });

  return {
    show,
    hide,
    destroy: () => container.destroy(true),
    setScore,
  };
}
