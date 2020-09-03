/**
 * 在 WebWorker 和 Node.js 中模拟 Sea.js
 */

/**
 * 判断运行平台
 * 第一种方法, 判断globalThis.constructor.name的值:
 * Window、DedicatedWorkerGlobalScope、Object
 * 第二种, 判断不同平台特有的globalThis的字段:
 * 含有`globalThis.process`的是Node.js
 * 否则, 含有`globalThis.window`或者`globalThis.document`的是Web
 * 否则, 含有`globalThis.FileReaderSync`的是WebWorker
 */
function js_platform() {
    if (globalThis.constructor.name === 'Window') return 'web';
    if (globalThis.constructor.name === 'DedicatedWorkerGlobalScope') return 'worker';
    if (globalThis.constructor.name === 'Object') return 'node';
    return globalThis.process ? 'node' : (globalThis.window ? 'web' : (globalThis.FileReaderSync ? 'worker' : 'unknown'));
}

/**
 * 获取运行该函数的脚本的绝对路径
 */
function get_absolute_path() {
    if (globalThis.constructor.name === 'Window') return (document.currentScript && document.currentScript.src) || document.location.href;
    if (globalThis.constructor.name === 'DedicatedWorkerGlobalScope') return globalThis.location.href;
    if (globalThis.constructor.name === 'Object') return module.filename;
}

function get_seajs_use_func() {
    /**
     * "模块"类
     */
    class _Module {
        constructor(name) {
            this.exports = {};
        }
    }
    let modules = {};
    /** 注册插件 */
    function register(name_script, module) {
        modules[name_script] = module;
    }
    /** 解析依赖脚本名称 */
    function resolve(path_script, name_require_script) {
        if (name_require_script.match(/^\//)) return name_require_script; // 绝对路径
        // 相对路径
        let path = path_script.replace(/(.*\/).*/, '$1') + name_require_script.replace(/^\.\//, '');
        if (!path.match(/.*\.js$/)) {
            path += '.js';
        }
        return path;
    }
    /**
     * 注册或执行模块
     * @param {*} path_script 
     * @param {*} callback 
     */
    function seajs_use(path_script, callback) {
        /**
         * 模拟define()函数,传入require函数
         * @param {() => {}} callback 
         */
        function _define(callback2) {
            if (modules[path_script]) {
                return modules[path_script];
            }
            const module = new _Module();
            callback2(_require, module.exports, module);
            register(path_script, module);
        }
        /**
         * 模拟require()函数,根据name_script解析name_requrie_script,然后注册
         */
        function _require(name_require_script) {
            let resolved_name = resolve(path_script, name_require_script);
            let module = modules[resolved_name];
            if (!module) {
                seajs_use(resolved_name);
                module = modules[resolved_name];
            }
            return module.exports;
        }
        // 执行脚本
        switch (js_platform()) {
            case 'web': { // 浏览器实现
                globalThis.define = _define; // 将全局对象传递到即将加载的脚本中
                globalThis.require = _require; // 脚本调用require将再次调用seajs_use
                globalThis.window = {}; // 防止window未定义
                let element_script = document.createElement('script');
                element_script.src = path_script;
                document.body.appendChild(element_script); // js将被异步加载
                // callback && callback(modules[path_script].exports); // 异步代码, 不可行
                let return_module = () => { callback && callback(modules[path_script].exports); };
                // 未解决的操作
                break;
            }
            case 'worker': { // 浏览器Worker实现
                // define和require将在调用seajs_use以执行的脚本中调用
                globalThis.define = _define; // 将全局对象传递到即将加载的脚本中
                globalThis.require = _require; // 脚本调用require将再次调用seajs_use
                globalThis.window = {}; // 防止window未定义
                importScripts(path_script); // importScripts自动处理相对路径
                // 此处代码是同步的, 非常容易处理, 因为_define()函数已经被执行
                callback && callback(modules[path_script].exports);
                break;
            }
            case 'node': { // Node.js实现
                globalThis.define = _define; // 将全局对象传递到即将加载的脚本中
                globalThis.require = _require; // 脚本调用require将再次调用seajs_use
                globalThis.window = {}; // 防止window未定义
                require(path_script);
                break;
            }
            default: {
                console.log('Sorry, Unknown platform.');
            }
        } // switch
    }
    return seajs_use;
}

// 需要支持从WebWorker加载, 被Webpack打包到Web, 被Node原生加载
// WebWorker中使用importScripts()函数导入本文件即可, 所有的代码将被合并执行
switch (js_platform()) {
    case 'node': // Node和Webpack都支持module.exports
    case 'web': {
        module.exports = {
            js_platform,
            get_absolute_path,
            use: get_seajs_use_func(),
        };
        break;
    }
    case 'worker': {
        console.log('sea.js函数已公开');
        break;
    }
}