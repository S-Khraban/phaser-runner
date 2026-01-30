export const START_MODAL = {
  layout: {
    width: 720,
    padding: 22,
    panelMaxH: 560,
    panelHFactor: 0.9,
    topOffset: 52,
    gapAfterRules: 18,
    scoreOffsetFromButtons: 18,
  },

  colors: {
    dim: 0x000000,
    panel: 0x111111,
    button: 0x2d7dff,
    buttonHover: 0x4a92ff,
    white: 0xffffff,
  },

  alpha: {
    dim: 0.55,
    panel: 0.92,
    stroke: 0.15,
    btnStroke: 0.18,
  },

  text: {
    title: {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    },
    body: {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#eaeaea',
      lineSpacing: 7,
    },
    button: {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    },
    score: {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
    },
  },

  button: {
    w: 220,
    h: 52,
    gap: 20,
  },

  depth: 10_000,
};
