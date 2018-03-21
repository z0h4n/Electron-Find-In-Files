const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
const createApplicationMenu = require('./menu');

let main_window = null;

function createWindow() {
  main_window = new BrowserWindow({ title: `${app.getName()} - An Electron App`, height: 400, minHeight: 400, width: 800, minWidth: 800 });

  main_window.on('closed', function () {
    main_window = null;
  });

  main_window.loadURL(url.format({
    pathname: path.resolve(__dirname, 'finder.html'),
    protocol: 'file:',
    slashes: true
  }));

  createApplicationMenu(main_window);

  // main_window.webContents.openDevTools();
}

app.on('ready', createWindow);