# my-electron-app

A minimal Electron app that renders an image in a frameless, transparent desktop window.

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

# 2. Install dependencies (downloads Electron)
npm install

# 3. Start the app
npm start
```

A borderless window appears showing the image. Drag anywhere on it to move the window; press `Alt+F4` (Windows) or `Cmd+Q` (macOS) to quit.

## Project structure

| File           | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| `main.js`      | Electron main process — creates the window and loads the page. |
| `index.html`   | The window content — displays the image.                       |
| `multi.png`    | The image being rendered.                                      |
| `package.json` | Scripts and dependencies (`npm start` runs `electron .`).      |

To use a different image, drop it in the project folder and update the `src` in `index.html`.
