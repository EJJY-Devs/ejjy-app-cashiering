const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Menu, MenuItem } = require('electron');

const isDev = process.env.APP_DEV ? process.env.APP_DEV.trim() == 'true' : false;
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		// frame: false,
		fullscreen: !isDev, // Auto full screen only in production
	});

	const startURL = isDev
		? 'http://localhost:3004'
		: `file://${path.join(__dirname, '../build/index.html')}`;
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

	if (isDev) {
		menu.append(
			new MenuItem({
				label: 'Dev',
				submenu: [{ role: 'toggleDevTools' }, { role: 'forceReload' }],
			}),
		);
	}

	Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow);
