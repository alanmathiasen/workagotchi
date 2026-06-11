import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";
import {
  alimentarImg as alimentarUrl,
  obeliscoImg as obeliscoUrl,
  happinessImg as loboUrl, // the "lobo" sprite is the happiness face
  gameOverImg as gameOverUrl,
  cloudImgs as CLOUD_URLS,
  stoneImg as stoneUrl,
} from "../../img";

const ITEM_COUNT = 5;
const PLAYER_SPEED = 480; // px/sec
const PLAYER_W = 120;
const PLAYER_H = 22;
const PLAYER_Y = GAME_HEIGHT - 70;
const ITEM_R = 34; // half-size of a falling item (used for both rendering and collision)
const BAD_CHANCE = 0.3; // ~30% of spawned items are obeliscos (bad)
const WIN_TARGET = 10; // catch this many good medialunas to win
const NUM_CLOUDS = 5; // how many clouds drift across the sky
const CLOUD_KEY = "cloud0"; // use ONE cloud image for all so they match (try cloud0..cloud4)

export default class CatchScene extends Phaser.Scene {
  constructor() {
    super("catch");
  }

  preload() {
    // Rasterize the SVG to the size we'll render at. Phaser waits for this
    // before running create(), so no async handling is needed.
    // Rasterize at high resolution; we scale DOWN when displaying. Downscaling
    // stays crisp, whereas upscaling a small texture looks blurry/blocky.
    const TEX = 256;
    this.load.svg("alimentar", alimentarUrl, { width: TEX, height: TEX });
    this.load.svg("obelisco", obeliscoUrl, { width: TEX, height: TEX });
    this.load.svg("lobo", loboUrl, { width: TEX, height: TEX });
    this.load.svg("gameover", gameOverUrl, { width: TEX, height: TEX });
    CLOUD_URLS.forEach((url, i) => this.load.image(`cloud${i}`, url));
    this.load.image("stone", stoneUrl);
  }

  create() {
    this.score = 0;
    this.missed = 0;
    this.isOver = false;

    // Drifting background clouds (rendered behind everything).
    this.clouds = [];
    for (let i = 0; i < NUM_CLOUDS; i++) {
      const cloud = this.add.image(0, 0, CLOUD_KEY).setDepth(-1);
      this.resetCloud(cloud, true);
      this.clouds.push(cloud);
    }

    // Row of stones along the bottom (decorative ground, in front of the player).
    // STONE_STEP < STONE_W so each stone overlaps the previous one.
    const STONE_W = 72;
    const STONE_STEP = 50;
    for (let x = 0; x < GAME_WIDTH + STONE_W; x += STONE_STEP) {
      const stone = this.add.image(x, GAME_HEIGHT, "stone").setOrigin(0, 1).setDepth(1);
      stone.setDisplaySize(STONE_W, STONE_W * (stone.height / stone.width)); // keep ratio
    }

    // Player paddle (origin is centered for Phaser shapes).
    this.player = this.add.image(GAME_WIDTH / 2, PLAYER_Y, "lobo");
    this.player.setScale(PLAYER_W / this.player.width); // width = PLAYER_W, height keeps ratio

    // Five falling items (good medialunas + the occasional bad red one).
    this.items = [];
    for (let i = 0; i < ITEM_COUNT; i++) {
      const item = this.add.image(0, 0, "alimentar");
      item.setDisplaySize(ITEM_R * 2, ITEM_R * 2);
      this.items.push(item);
      this.spawnItem(item, true);
    }

    // Input: arrow keys + A/D.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("A,D");

    // HUD.
    this.hud = this.add.text(12, 12, "", {
      fontFamily: "system-ui, sans-serif",
      fontSize: "20px",
      color: "#111111",
    });
    this.add.text(
      12,
      GAME_HEIGHT - 28,
      "← / →  o  A / D  ·  evitá los obeliscos",
      {
        fontFamily: "system-ui, sans-serif",
        fontSize: "13px",
        color: "#888888",
      },
    );
    this.updateHud();
  }

  // Place an item back at the top with a random column, fall speed, and good/bad type.
  spawnItem(item, initial = false) {
    item.x = Phaser.Math.Between(ITEM_R, GAME_WIDTH - ITEM_R);
    // Stagger the very first spawn up the screen so they don't fall as one row.
    item.y = initial
      ? Phaser.Math.Between(-GAME_HEIGHT, -ITEM_R)
      : Phaser.Math.Between(-160, -ITEM_R);
    item.fallSpeed = Phaser.Math.Between(160, 300);

    // Bad items are obeliscos, good ones are medialunas.
    item.isBad = Math.random() < BAD_CHANCE;
    item.setTexture(item.isBad ? "obelisco" : "alimentar");
    item.setDisplaySize(ITEM_R * 2, ITEM_R * 2);
    item.setAngle(item.isBad ? 180 : 0); // flip the obelisco upside-down
  }

  // Place a cloud at a random height/size; drifting starts from the left edge.
  resetCloud(cloud, initial = false) {
    const targetW = Phaser.Math.Between(90, 170);
    cloud.setScale(targetW / cloud.width);
    cloud.setAlpha(0.7); // slightly transparent
    cloud.y = Phaser.Math.Between(30, GAME_HEIGHT * 0.45);
    cloud.x = initial
      ? Phaser.Math.Between(0, GAME_WIDTH)
      : -cloud.displayWidth / 2;
    cloud.speed = Phaser.Math.Between(15, 45); // px/sec — slow drift
  }

  // Drift clouds left → right, wrapping back to the left when off-screen.
  updateClouds(dt) {
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * dt;
      if (cloud.x - cloud.displayWidth / 2 > GAME_WIDTH) {
        this.resetCloud(cloud);
      }
    }
  }

  updateHud() {
    this.hud.setText(`🎯 ${this.score}`);
  }

  endGame(result) {
    this.isOver = true;

    // Clear the falling items off the screen.
    this.items.forEach((item) => item.setVisible(false));

    const won = result === "win";

    // On lose, the player turns into the "game over" sprite.
    if (!won) {
      this.player.setTexture("gameover");
      this.player.setScale(PLAYER_W / this.player.width); // keep the same on-screen width
    }

    const message = won
      ? "¡GANASTE!\ncomiste 10 medialunas marplatenses\n\npulsá una tecla para salir"
      : "¡PERDISTE!\nte tocó un porteño\n\npulsá una tecla para salir";

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, message, {
        fontFamily: "system-ui, sans-serif",
        fontSize: "30px",
        color: won ? "#1b9c3f" : "#ff6b6b",
        align: "center",
      })
      .setOrigin(0.5);

    // Tell the dashboard (via the main process) how the game ended.
    window.api?.minigame?.reportResult(result);

    // Next key press restarts the game.
    this.input.keyboard.once("keydown", () => this.scene.restart());
    // To close the window instead, use:
    // this.input.keyboard.once("keydown", () => window.close());
  }

  update(_time, delta) {
    const dt = delta / 1000; // seconds since last frame
    this.updateClouds(dt);

    if (this.isOver) return;

    // --- Move the player ---
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    if (left) this.player.x -= PLAYER_SPEED * dt;
    else if (right) this.player.x += PLAYER_SPEED * dt;

    const halfW = PLAYER_W / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x, halfW, GAME_WIDTH - halfW);

    const playerTop = PLAYER_Y - PLAYER_H / 2;
    const playerBottom = PLAYER_Y + PLAYER_H / 2;

    // --- Drop, catch, or miss each item ---
    for (const item of this.items) {
      item.y += item.fallSpeed * dt;

      const overlapsVertically =
        item.y + ITEM_R >= playerTop && item.y - ITEM_R <= playerBottom;
      const overlapsHorizontally =
        Math.abs(item.x - this.player.x) <= halfW + ITEM_R;

      if (overlapsVertically && overlapsHorizontally) {
        if (item.isBad) {
          this.endGame("lose");
          return; // stop processing the rest of this frame
        }
        this.score += 1;
        this.updateHud();
        if (this.score >= WIN_TARGET) {
          this.endGame("win");
          return;
        }
        this.spawnItem(item);
        continue;
      }

      // Fell past the bottom: only good medialunas count as "missed".
      if (item.y - ITEM_R > GAME_HEIGHT) {
        if (!item.isBad) {
          this.missed += 1;
          this.updateHud();
        }
        this.spawnItem(item);
      }
    }
  }
}
