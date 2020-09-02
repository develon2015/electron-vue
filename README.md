# electron-vue

## auto-reload.js

针对不同平台实现自动重载.

在Windows平台下通过使用`taskkill /IM electron.exe /F`命令强制关闭electron进程.

## webpack.config.js

在一套配置文件中增加`production`和`rebuild`两个选项.

对于向webpack传递的`--env.rebuild`参数, 在Windows平台下使用`rmdir /S /Q "${DIR_DIST}"`命令删除构建目录.
