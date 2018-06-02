/* 生成app:
 * npm run package 
 * 安装依赖:
 * cnpm install */

const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences:{webSecurity: false} //toDataURL有跨域限制
    });
    win.loadURL(`file://${__dirname}/renderer/camera.html`); //只能使用绝对路径(σ｀д′)σ

    // console.log(this);  //返回{}.....
    //默认是全局对象调用这个函数,所以要绑定....
    // ipcMain.on('toggleDev', win.toggleDevTools.bind(win));
    ipcMain.on('exit', app.quit.bind(app));
    ipcMain.on('toggleWindow', () => {
        //注意窗口最大化和全屏的区别
        if (win.isFullScreen())
            // win.setBounds({ x, y, width: 1000, height: 600 });
            win.setFullScreen(false);
        else win.setFullScreen(true);
    })
})

app.on('window-all-closed', app.quit.bind(app));

// console.log(__dirname);