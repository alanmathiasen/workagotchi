import { contextBridge, ipcRenderer } from 'electron';

// Safe bridge exposed to the renderer as window.api
contextBridge.exposeInMainWorld('api', {
  openDashboard: () => ipcRenderer.send('open-dashboard'),
  openMinigame: () => ipcRenderer.send('open-minigame'),
  moveWindowBy: (dx, dy) => ipcRenderer.send('move-window-by', dx, dy),

  game: {
    // Fetch the current state once (e.g. on load).
    getState: () => ipcRenderer.invoke('game:get-state'),
    // Subscribe to state updates; returns an unsubscribe function.
    onState: (callback) => {
      const handler = (_event, state) => callback(state);
      ipcRenderer.on('game:state', handler);
      return () => ipcRenderer.removeListener('game:state', handler);
    },
    // Send a command to the game loop (feed/play/rest).
    command: (name) => ipcRenderer.send('game:command', name),
  },

  minigame: {
    // Called by the Phaser window when the player wins or loses ('win' | 'lose').
    reportResult: (result) => ipcRenderer.send('minigame:result', result),
    // Subscribe to that result from another window (e.g. the dashboard).
    onResult: (callback) => {
      const handler = (_event, result) => callback(result);
      ipcRenderer.on('minigame:result', handler);
      return () => ipcRenderer.removeListener('minigame:result', handler);
    },
  },
});
