const { app, Notification, Menu, BrowserWindow, MenuItem, ipcMain, } = require('electron');
const path = require('path');

let window = null;
let menu = null;

app.whenReady().then(() => {
  setupWindow();
  init();
});

ipcMain.on('test', (e, param1, param2) => {
  console.log({ e });
  console.log({ param1, param2 });
});

function init() {
  window.loadURL('http://localhost');
  window.flashFrame(true); // 状态栏闪烁
  new Notification({
    title: '应用程序已加载',
    body: '该程序用于演示Electron的功能和架构.'
  }).show(); // 桌面通知(右下角前置)
}

app.on('window-all-closed', () => {
  app.quit();
});

function setupWindow() {
  window = new BrowserWindow({
    useContentSize: true,
    width: 420,
    height: 780,
    width: 1400,
    height: 800,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // setupMenu();
}

function setupMenu() {
  menu = new Menu();
  menu.append(new MenuItem({
    label: '菜单',
    type: 'submenu',
    submenu: [
      new MenuItem({ label: '重新加载', click(item) {
          init();
        }
      }),
      new MenuItem({ label: '退出', click(item) {
          app.quit();
        }
      }),
    ],
  }));
  window.setMenu(menu);
}