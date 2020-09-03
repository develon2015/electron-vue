<template>
<div id="app">
    <div>
        <span>GeoJSON</span>
    </div>
</div>
</template>

<script>
class TwoMgr {
    constructor(container, options) {
        this.options = options;
        const default_optins = {
            fullscreen: 'true',
            type: 'CanvasRenderer',
        };
        this.two = new Two({
            ...default_optins,
            ...options,
        });
        this.container = container;
        this.two.appendTo(container);
    }
    /** 屏幕坐标转换, x不变y旋转 */
    fix(x, y) {
        const H = this.container.clientHeight;
        const W = this.container.clientWidth;
        return [x, H - y];
    }
    draw_point(x, y) {
        [x, y] = this.fix(x, y);
        console.log([x, y]);
        let c = this.two.makeCircle(x, y, this.options.point_d || 20);
        c.noStroke();
        c.fill = '#880088';
        this.two.update();
    }
}

/**
 * 弹出选择文件对话框
 * 解析JSON文件然后绘图
 */
class GeoMgr {
    constrcutor() {
    }
    /** 绘制Geo对象 */
    open(text) {
        console.log(text);
    }
    /** 打开文件, 异步返回JSON对象 */
    popFileSelector() {
        return new Promise((resolve, reject) => {
            let input = document.createElement('input');
            input.value = '选择文件';
            input.type = 'file';
            input.accept= '.json';
            input.onchange = event => {
                let file = event.target.files[0];
                let file_reader = new FileReader();
                file_reader.onload = () => {
                    let fc = file_reader.result;
                    try {
                        resolve(JSON.parse(fc)); // 解析.json文件内容为对象, 并返回到Promise
                    } catch(error) {
                        reject(error);
                    }
                };
                file_reader.readAsText(file, 'UTF-8');
            };
            input.click();
        });
    }
}

export default {
    methods: {},
    mounted() {
        globalThis.two_mgr = new TwoMgr(app, {
            point_d: 8,
        });
        two_mgr.draw_point(0, 0);
        two_mgr.draw_point(0, 80);
        two_mgr.draw_point(280, 0);
        two_mgr.draw_point(280, 280);

        globalThis.geo_mgr = new GeoMgr();
        app.onclick = () => {
            geo_mgr.popFileSelector().then(json => {
                geo_mgr.open(json);
            }).catch(error => {
                alert('文件格式错误');
            });
        }
    },
}
</script>

<style scoped>
#app {
    min-height: 100vh;
    min-width: 100vw;
}
</style>
