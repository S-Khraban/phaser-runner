export function createHud(scene) {
  let score = 0;

  const scoreText = scene.add
    .text(16, 16, 'Tokens: 0', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
      fontSize: '20px',
      color: '#ffffff',
    })
    .setScrollFactor(0);

  return {
    addToken() {
      score += 1;
      scoreText.setText(`Tokens: ${score}`);
    },
    getScore() {
      return score;
    },
  };
}
