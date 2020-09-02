/**
 * 针对不同平台实现自动重载.
 * 在Windows平台下通过使用taskkill /IM electron.exe /F命令强制关闭electron进程.
 */
const fs = require('fs');
const child_process = require('child_process');
const _ = require('lodash');

const rules = [
    { event: 'change', test: /^main\.js$/ },
];

/**
 * 监听源码文件事件
 * @param {Array} rules 规则数组, 每个规则是包含了"事件名"字符串和"文件名"正则表达式两个字段的对象: { event, test }
 */
function watch_source_code_file(rules) {
    fs.watch(__dirname, {}, (event, filename) => {
        rules.forEach(it => {
            if (event === it.event && it.test.test(filename)) {
                _handler(event, filename); // 如果源码发生了变化, 则执行_handle()函数的相关逻辑
            }
        });
    });

    // 一次"保存文件"的操作可能触发多次"change"事件, 因此使用Lodash提供的函数去抖动功能
    const _handler = _.debounce(handler, 800, { leading: true, trailing: false, });
}

/** 编码electron主程序相关文件变化应该执行的操作 */
function handler(event, filename) {
    reload_electron();
}

/** 重启electron主程序, 请调用者捕获异常 */
function reload_electron() {
    try {
        kill_electron();
    } catch (error) {
        console.error(error);
        console.log('未能成功关闭electron进程, 或electron进程不存在');
    }
    start_electron();
}

/** 不同平台下关闭electron进程的实现 */
function kill_electron() {
    if (process.platform.match(/^win.*/)) { // Implement this on Windows OS
        // child_process.execSync(`taskkill /PID electron.exe /F`);
        child_process.execSync(`taskkill /IM electron.exe /F`);
    } else if (process.platform.match(/^linux.*/)) { // Implement this on Linux OS
        globalThis.electron && globalThis.electron.kill();
    }
}

/** 不同平台下启动electron进程的实现 */
function start_electron() {
    if (process.platform.match(/^win.*/)) { // Implement this on Windows OS
        const cmd = `start cmd /c electron "${__dirname}/main.js"`;
        child_process.exec(cmd);
    } else if (process.platform.match(/^linux.*/)) { // Implement this on Linux OS
        const cmd = `bash -c 'electron "${__dirname}/main.js"'`;
        globalThis.electron = child_process.exec(cmd); // Linux下可以记录PID以kill进程, 当然也可以使用"pkill -ef electron"命令
    }
}

/** 主程序 */
function main() {
    watch_source_code_file(rules);
    start_electron();
}

main();