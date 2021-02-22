const { app, BrowserWindow } = require('electron');
const { Menu, MenuItem } = require('electron');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		fullscreen: false, // Auto full screen only in production
	});

	const startURL = 'http://localhost:3004';
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
	menu.append(
		new MenuItem({
			label: 'Dev',
			submenu: [{ role: 'toggleDevTools' }, { role: 'forceReload' }],
		}),
	);

	Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow);
