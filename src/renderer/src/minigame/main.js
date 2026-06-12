import Phaser from 'phaser';
import '@fontsource/press-start-2p'; // bundled @font-face (loads locally, no CDN race)
import CatchScene from './CatchScene';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import '../minigame.css';

function startGame() {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#87ceeb',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [CatchScene],
  });
}

// Phaser draws text to a canvas, so the web font must be loaded BEFORE the
// scene renders or it silently falls back to the default. The Google Fonts
// @import is async, so the @font-face may not be registered yet on the first
// frame — document.fonts.load() would then resolve immediately doing nothing.
// Poll (re-calling load each time) until the font actually reports ready, with
// a timeout so a slow/offline fetch never blocks the game forever.
const FONT = '16px "Press Start 2P"';

async function waitForFont(timeoutMs = 3000, stepMs = 50) {
  const start = performance.now();
  while (performance.now() - start < timeoutMs) {
    try {
      await document.fonts.load(FONT);
    } catch {
      /* face not registered yet — keep waiting */
    }
    if (document.fonts.check(FONT)) return;
    await new Promise((r) => setTimeout(r, stepMs));
  }
}

waitForFont().then(startGame);
