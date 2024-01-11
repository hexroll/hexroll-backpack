// Hexroll Backpack - the offline sandbox viewer
// Copyright (C) 2023 Ithai Levi <ithai@pendicepaper.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const sqlite3 = require('better-sqlite3');
let stmt = undefined;
let db = undefined;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setMenuBarVisibility(false);

  const dialogOptions = {
    filters: [{ name: 'Hexroll Backpack Files', extensions: ['hbf'] }],
    properties: ['openFile'],
  };

  dialog.showOpenDialog(dialogOptions).then((filePaths) => {
    try {
      app.db = sqlite3(filePaths.filePaths[0]);
      app.stmt = app.db.prepare('SELECT value FROM Entities WHERE uuid=?');
      app.stmt2 = app.db.prepare(
        'SELECT value, details, uuid, type, icon, anchor FROM Refs WHERE value LIKE ? LIMIT 100',
      );
      mainWindow.loadFile(path.join(__dirname, 'index.html'));
    } catch (error) {
      console.log(error);
      app.quit();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-map', async (event) => {
  return new Promise(async (resolve) => {
    try {
      const row = app.stmt.get('map');
      resolve(row.value);
    } catch (error) {
      console.log(error);
    }
  });
});

ipcMain.handle('get-html', async (event, uuid) => {
  return new Promise(async (resolve) => {
    const row = app.stmt.get(uuid);
    resolve(row.value);
  });
});

ipcMain.handle('get-city', async (event, uuid) => {
  return new Promise(async (resolve) => {
    const row = app.stmt.get(uuid + '_city');
    resolve(row.value);
  });
});

ipcMain.handle('get-dungeon', async (event, uuid) => {
  return new Promise(async (resolve) => {
    const row = app.stmt.get(uuid + '_dungeon');
    resolve(row.value);
  });
});

ipcMain.handle('get-hazards', async (event, uuid) => {
  return new Promise(async (resolve) => {
    const row = app.stmt.get(uuid + '_hazards');
    resolve(row ? row.value : '{"hazards": []}');
  });
});

ipcMain.handle('search', async (event, term) => {
  return new Promise(async (resolve) => {
    const rows = app.stmt2.all('%' + term + '%');
    resolve(rows);
  });
});

ipcMain.on('close-me', (evt, arg) => {
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
