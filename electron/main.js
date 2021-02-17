const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Menu, MenuItem } = require('electron');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});
	// const startURL = `file://${path.join(__dirname, '../build/index.html')}`;
	const startURL = 'http://localhost:3004'; // DEV
	mainWindow.loadURL(startURL);

	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Set menu
	const menu = new Menu();
	menu.append(
		new MenuItem({
			label: 'Electron',
			submenu: [
				{
					role: 'help',
					accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
					click: () => {
						console.log('Electron rocks!');
					},
				},
			],
		}),
	);

	Menu.setApplicationMenu(menu);
}
app.on('ready', createWindow);
