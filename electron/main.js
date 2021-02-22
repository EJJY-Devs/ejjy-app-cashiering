const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Menu, MenuItem } = require('electron');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		fullscreen: true, // Auto full screen only in production
	});

	const startURL = `file://${path.join(__dirname, '../build/index.html')}`;
	mainWindow.loadURL(startURL);

	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Remove menu
	const menu = new Menu();
	Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow);
