const {app, BrowserWindow} = require('electron');


function createWindow () {

  // add w:17 w:45 for electron chrome
  //win = new BrowserWindow({ width: 697, height: 535 });
  win = new BrowserWindow({ width: 1024+17, height: 768+45 });
  win.setFullScreen(process.platform !== 'darwin');
  //win.webContents.openDevTools();
  win.loadFile('index.html');
}

/*app.setLoginItemSettings({
  openAtLogin: arg.settings.startOnStartup,
  path: electron.app.getPath("exe")
});*/

app.on('ready', createWindow);
