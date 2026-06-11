import { join } from "path";
import { app, BrowserWindow, Menu, ipcMain } from "electron";
import { createGame } from "./workagotchi/game.js";

const rendererUrl = process.env["ELECTRON_RENDERER_URL"];
const isDev = !!rendererUrl;

const game = createGame();

let dashboardWin = null;
let minigameWin = null;

// Re-enable DevTools shortcuts (F12 / Ctrl+Shift+I) on every window, since
// Menu.setApplicationMenu(null) removed the default toggleDevTools accelerator.
function enableDevToolsShortcut(contents) {
  contents.on("before-input-event", (_event, input) => {
    if (input.type !== "keyDown") return;
    const isF12 = input.key === "F12";
    const isCtrlShiftI =
      input.control && input.shift && input.key.toLowerCase() === "i";
    if (isF12 || isCtrlShiftI) {
      if (contents.isDevToolsOpened()) contents.closeDevTools();
      else contents.openDevTools({ mode: "detach" });
    }
  });
}

// Load a page either from the dev server (dev) or the built files (production).
function loadPage(win, page) {
  if (rendererUrl) {
    win.loadURL(`${rendererUrl}/${page}.html`);
  } else {
    win.loadFile(join(__dirname, `../renderer/${page}.html`));
  }
}

function createFloatingWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  });

  loadPage(win, "floating");
}

function createDashboardWindow() {
  if (dashboardWin && !dashboardWin.isDestroyed()) {
    dashboardWin.focus();
    return;
  }

  dashboardWin = new BrowserWindow({
    width: 900,
    height: 600,
    title: "Dashboard",
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  });

  loadPage(dashboardWin, "dashboard");

  dashboardWin.on("closed", () => {
    dashboardWin = null;
  });
}

function createMinigameWindow() {
  if (minigameWin && !minigameWin.isDestroyed()) {
    minigameWin.focus();
    return;
  }

  minigameWin = new BrowserWindow({
    width: 640,
    height: 720,
    title: "Catch Game",
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
    },
  });

  loadPage(minigameWin, "minigame");

  minigameWin.on("closed", () => {
    minigameWin = null;
  });
}

app.on("web-contents-created", (_event, contents) => {
  enableDevToolsShortcut(contents);
  // Auto-open DevTools (detached) for every window on creation.
  contents.on("did-finish-load", () => contents.openDevTools({ mode: "detach" }));
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);

  // Floating window asks the main process to open the dashboard.
  ipcMain.on("open-dashboard", createDashboardWindow);

  // Dashboard button opens the Phaser catch game.
  ipcMain.on("open-minigame", createMinigameWindow);

  // Relay the game's win/lose result to every window (floating pet + dashboard).
  ipcMain.on("minigame:result", (event, result) => {
    for (const win of BrowserWindow.getAllWindows()) {
      // Skip the game window that sent it.
      if (win.webContents !== event.sender) {
        win.webContents.send("minigame:result", result);
      }
    }
  });

  // Floating window drives custom dragging by sending mouse deltas.
  ipcMain.on("move-window-by", (event, dx, dy) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    const [x, y] = win.getPosition();
    win.setPosition(Math.round(x + dx), Math.round(y + dy));
  });

  // --- Game loop wiring ---
  // Broadcast every state change to all open windows.
  game.subscribe((state) => {
    for (const win of BrowserWindow.getAllWindows()) {
      win.webContents.send("game:state", state);
    }
  });
  // Let any window fetch the current state on load...
  ipcMain.handle("game:get-state", () => game.getState());
  // ...and send commands (feed/play/rest).
  ipcMain.on("game:command", (_event, name) => game.command(name));
  game.start();

  createFloatingWindow();
  createMinigameWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createFloatingWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => game.stop());
