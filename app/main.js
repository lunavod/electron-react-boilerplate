// Modules to control application life and create native browser window
const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	netLog,
	ipcMain
} = require('electron')

const { autoUpdater } = require("electron-updater")
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"

const path = require('path')
const fs = require('fs')

const args = process.argv.slice(2)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
	ipcMain.on('ready-for-updates', (event) => {
		autoUpdater.once('update-available', () => {
			event.sender.send('update-available')
		}) 
		autoUpdater.once('update-downloaded', () => {
			event.sender.send('update-downloaded')
			event.sender.send('download-progress', 100)
		}) 

		autoUpdater.on('download-progress', (p_event) => {
			console.log(event)
			event.sender.send('download-progress', p_event.percent)
		}) 

		autoUpdater.checkForUpdates()
	}) 

	ipcMain.on('quit-and-install', () => {
		autoUpdater.quitAndInstall()
	})

	let iconPath = path.resolve(require('path').dirname(process.execPath)+'/assets/icon.png')
	if (!fs.existsSync(iconPath)) {
		iconPath = path.resolve('app/icon.png')
	}
	if (!fs.existsSync(iconPath)) {
		iconPath = path.resolve('icon.png')
	}
	console.log(iconPath)
	function hideApp() {
		appIcon = new Tray(iconPath)
		function showWindow() {
			mainWindow.show()
			appIcon.destroy()
		}
	var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: showWindow
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
            }
        }
    ])
	  appIcon.setContextMenu(contextMenu)
	  appIcon.on('click', ()=>showWindow())
        mainWindow.hide()
	}

	// and load the index.html of the app.
	if (args[0] == 'development') {
		mainWindow = new BrowserWindow({
			width: 1600,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
				nodeIntegration: true
			},
			icon: iconPath,
			frame: false,
		})
		mainWindow.loadURL('http://localhost:8080/index.html')
		mainWindow.webContents.openDevTools()
	} else {
		mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
				nodeIntegration: true
			},
			icon: iconPath,
			frame: false,
		})
		mainWindow.loadFile('dist/index.html')
		// mainWindow.webContents.openDevTools()
	}

	mainWindow.on('close', function (e) {
		// if (!app.isQuiting) {
		// 	e.preventDefault()
		// 	hideApp()
		// }
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	mainWindow.on('minimize', function (event) {
		// event.preventDefault()
		// hideApp()
	})

	ipcMain.on('minimize', () => {
		mainWindow.minimize()
	})

	ipcMain.on('maximize', () => {
		mainWindow.maximize()
	})

	ipcMain.on('unmaximize', () => {
		mainWindow.unmaximize()
	})

	ipcMain.on('fake-close', () => {
		hideApp()
	})

	ipcMain.on('is-maximized', (event) => {
		event.returnValue = mainWindow.isMaximized
	})
}

function enableAutoLaunch() {
	const AutoLaunch = require('auto-launch');
	const appAutoLauncher = new AutoLaunch({
		name: 'Timer',
	});
	 
	appAutoLauncher.enable();
	 
	//minecraftAutoLauncher.disable();
	 
	 
	appAutoLauncher.isEnabled()
	.then(function(isEnabled){
		if(isEnabled){
			return;
		}
		appAutoLauncher.enable();
	})
	.catch(function(err){
		// handle error
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
if (args[0] != 'development') {
	app.on('ready', enableAutoLaunch)
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.