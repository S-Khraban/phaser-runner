export function createHud(scene) {
  let tokens = 0;

  const hearts = { current: 3, max: 5 };
  const pickaxe = { durability: 5, max: 5, active: true };

  const baseTextStyle = {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
    fontSize: '20px',
    color: '#ffffff',
  };

  const ui = {
    tokensIcon: scene.add.text(16, 16, '🪙', baseTextStyle).setScrollFactor(0),
    tokensValue: scene.add.text(44, 16, '0', baseTextStyle).setScrollFactor(0),

    heartsRow: [],
    pickaxeIcon: null,
    pickaxeCells: [],
  };

  function renderTokens() {
    ui.tokensValue.setText(String(tokens));
  }

  function renderHearts() {
    if (ui.heartsRow.length === 0) {
      for (let i = 0; i < hearts.max; i += 1) {
        const t = scene.add
          .text(16 + i * 24, 48, '🩶', baseTextStyle)
          .setScrollFactor(0);

        ui.heartsRow.push(t);
      }
    }

    for (let i = 0; i < hearts.max; i += 1) {
      ui.heartsRow[i].setText(i < hearts.current ? '❤️' : '🩶');
    }
  }

  function ensurePickaxeNodes() {
    if (!ui.pickaxeIcon) {
      ui.pickaxeIcon = scene.add
        .text(16, 80, '⛏️', baseTextStyle)
        .setScrollFactor(0);
    }

    if (ui.pickaxeCells.length === 0) {
      for (let i = 0; i < pickaxe.max; i += 1) {
        const cell = scene.add
          .text(48 + i * 18, 82, '🔲', {
            ...baseTextStyle,
            fontSize: '16px',
          })
          .setScrollFactor(0);

        ui.pickaxeCells.push(cell);
      }
    }
  }

  function renderPickaxe() {
    ensurePickaxeNodes();

    const visible = pickaxe.active && pickaxe.durability > 0;

    ui.pickaxeIcon.setVisible(visible);
    ui.pickaxeCells.forEach((c) => c.setVisible(visible));

    if (!visible) return;

    for (let i = 0; i < pickaxe.max; i += 1) {
      ui.pickaxeCells[i].setText(i < pickaxe.durability ? '🔳' : '🔲');
    }
  }

  renderTokens();
  renderHearts();
  renderPickaxe();

  return {
    addToken() {
      tokens += 1;
      renderTokens();
    },

    getScore() {
      return tokens;
    },

    getTokens() {
      return tokens;
    },

    addHeart() {
      hearts.current = Math.min(hearts.current + 1, hearts.max);
      renderHearts();
    },

    setHearts(value) {
      hearts.current = Math.max(0, Math.min(value, hearts.max));
      renderHearts();
    },

    getHearts() {
      return hearts.current;
    },

    getHeartsMax() {
      return hearts.max;
    },

    usePickaxe() {
      if (!pickaxe.active || pickaxe.durability <= 0) return false;

      pickaxe.durability -= 1;

      if (pickaxe.durability <= 0) {
        pickaxe.durability = 0;
        pickaxe.active = false;
      }

      renderPickaxe();
      return true;
    },

    addPickaxe() {
      pickaxe.durability = Math.min(pickaxe.durability + 5, pickaxe.max);
      pickaxe.active = pickaxe.durability > 0;
      renderPickaxe();
    },

    setPickaxeDurability(value) {
      pickaxe.durability = Math.max(0, Math.min(value, pickaxe.max));
      pickaxe.active = pickaxe.durability > 0;
      renderPickaxe();
    },

    hasPickaxe() {
      return pickaxe.active && pickaxe.durability > 0;
    },

    getPickaxeDurability() {
      return pickaxe.durability;
    },

    getPickaxeMax() {
      return pickaxe.max;
    },
  };
}
