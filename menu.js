const { app, Menu, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const opn = require('opn');

const links = {
  source: 'https://github.com/z0h4n/Electron-Find-In-Files',
  release: 'https://github.com/z0h4n/Electron-Find-In-Files/releases'
};

let about_window = null;

const template = [
  {
    label: app.getName(),
    submenu: [
      { label: 'About', click: about },
      { type: 'separator' },
      { label: 'Source', click: sourceLinks.bind(null, 'source') },
      { label: 'Releases', click: sourceLinks.bind(null, 'release') },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  }
];

function about(parent_window) {
  about_window = new BrowserWindow({
    title: `About ${app.getName()}`,
    parent: parent_window,
    width: 200,
    height: 200,
    resizable: false,
    minimizable: false,
    maximizable: false
  });

  // -- Remove menu bar from about window on Windows
  if (process.platform !== 'darwin') {
    about_window.setMenu(null);
  }

  about_window.on('closed', function () {
    about_window = null;
  });

  about_window.loadURL(url.format({
    pathname: path.resolve(__dirname, 'about.html'),
    protocol: 'file:',
    slashes: true
  }));
}

function sourceLinks(type) {
  if (links[type]) {
    opn(links[type], { wait: false });
  }
}

module.exports = function (parent_window) {
  about = about.bind(null, parent_window);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}