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
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', async () => {});

contextBridge.exposeInMainWorld('api', {
  get: async (uuid) => {
    try {
      const res = await ipcRenderer.invoke('get-html', uuid);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  map: async () => {
    try {
      const res = await ipcRenderer.invoke('get-map');
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  city: async (uuid) => {
    try {
      const res = await ipcRenderer.invoke('get-city', uuid);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  dungeon: async (uuid) => {
    try {
      const res = await ipcRenderer.invoke('get-dungeon', uuid);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  hazards: async (uuid) => {
    try {
      const res = await ipcRenderer.invoke('get-hazards', uuid);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  search: async (term) => {
    try {
      const res = await ipcRenderer.invoke('search', term);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  quit: () => {
    ipcRenderer.send('close-me');
  },
});
