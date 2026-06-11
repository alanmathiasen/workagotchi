import Phaser from 'phaser';
import CatchScene from './CatchScene';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import '../minigame.css';

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
