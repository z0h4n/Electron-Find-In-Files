const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const url = require('url');
const path = require('path');

let main_window = null;

function createWindow() {
  main_window = new BrowserWindow({ height: 185, minHeight: 185, width: 800, minWidth: 800 });

  main_window.on('closed', function () {
    main_window = null;
  });

  main_window.loadURL(url.format({
    pathname: path.resolve(__dirname, 'finder.html'),
    protocol: 'file:',
    slashes: true
  }));

  main_window.webContents.openDevTools();
}

function createMenu() {
  const template = [
    {
      label: app.getName(),
      submenu: [{ role: 'about' }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on('ready', function () {
  // createMenu();
  createWindow();
});