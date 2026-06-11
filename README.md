# my-electron-app

An Electron app with two windows: a frameless, transparent **floating image** on the
desktop, and a **dashboard** window built with React + Tailwind + shadcn/ui that opens
when you click the image.

Build tooling is [electron-vite](https://electron-vite.org) (Vite under the hood, with
hot reload).

## Prerequisites

You need **Node.js** (which includes `npm`). This project is built with Node 22 LTS.

### Install Node.js

**Windows / macOS — download the installer**

Go to [nodejs.org](https://nodejs.org) and download the **LTS** version, then run the installer.

**macOS / Linux — via a version manager (recommended)**

```bash
# install nvm, then:
nvm install --lts
nvm use --lts
```

**Verify the install:**

```bash
node -v   # should print v22.x or newer
npm -v
```

## Install & run

```bash
# 1. Clone the repo
git clone https://github.com/alanmathiasen/workagotchi.git
cd workagotchi

# 2. Install dependencies
npm install

# 3. Start the app (with hot reload)
npm run dev
```

The floating image appears on the desktop. **Grab its edges to move it; click the image
to open the dashboard.** Press `Alt+F4` (Windows) or `Cmd+Q` (macOS) to quit.

### Other scripts

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Run in development with hot reload.                   |
| `npm run build`   | Build the production bundle into `out/`.              |
| `npm run preview` | Run the production build locally.                     |

## Project structure

```
src/
├─ main/index.js        Electron main process — creates both windows.
├─ preload/index.js     Safe bridge (exposes window.api to the renderer).
└─ renderer/
   ├─ floating.html     The floating image window.
   ├─ dashboard.html    HTML entry for the React dashboard.
   ├─ multi.png         The image being rendered.
   └─ src/
      ├─ App.jsx        Dashboard UI (placeholder cards).
      ├─ index.css      Tailwind + shadcn theme tokens.
      ├─ components/ui/ shadcn components (card, button).
      └─ lib/utils.js   The shadcn `cn()` helper.
```

To use a different image, replace `src/renderer/multi.png` (or update the `src` in
`floating.html`).

### Adding more shadcn components

The project is wired for the shadcn CLI (`components.json` + the `@/` alias), so you can
pull in more components, e.g.:

```bash
npx shadcn@latest add badge dialog
```
