import { SOUND, AUDIO_ASSETS } from './audio.constants.js';

export function preloadAudio(scene) {
  AUDIO_ASSETS.forEach(({ key, src }) => {
    scene.load.audio(key, src);
  });
}

export function createAudio(scene, opts = {}) {
  const musicVolume = opts?.musicVolume ?? 0.3;

  const sfxVolumes = {
    coin: opts?.sfx?.coin ?? 0.3,
    boom: opts?.sfx?.boom ?? 0.6,
    gameover: opts?.sfx?.gameover ?? 0.5,
  };

  let musicStarted = false;

  const mainTheme = scene.sound.add(SOUND.MAIN, { loop: true, volume: musicVolume });

  function ensureMusicStarted() {
    if (musicStarted) return;
    musicStarted = true;

    if (mainTheme && !mainTheme.isPlaying) mainTheme.play();
  }

  function stopMusic() {
    if (mainTheme?.isPlaying) mainTheme.stop();
  }

  function playCoin() {
    ensureMusicStarted();
    scene.sound.play(SOUND.COIN, { volume: sfxVolumes.coin });
  }

  function playBoom() {
    ensureMusicStarted();
    scene.sound.play(SOUND.BOOM, { volume: sfxVolumes.boom });
  }

  function playGameover() {
    ensureMusicStarted();
    scene.sound.play(SOUND.GAMEOVER, { volume: sfxVolumes.gameover });
  }

  scene.input.once('pointerdown', ensureMusicStarted);
  scene.input.keyboard.once('keydown', ensureMusicStarted);

  function destroy() {
    stopMusic();
    mainTheme?.destroy?.();
  }

  return {
    ensureMusicStarted,
    stopMusic,
    sfx: {
      coin: playCoin,
      boom: playBoom,
      gameover: playGameover,
    },
    destroy,
  };
}
