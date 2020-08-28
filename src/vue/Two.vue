<template>
<!-- two.js 2D绘图应用 -->
<div id="app">
    写字板
</div>
</template>

<script>
import 'two.js';
// import $ from 'jquery'; // 如果不存在exlib.js

export default {
    data() {
        return {
            fill: '#880088',
            two: null,
            linewidth: 20,
            traces: [], // 记录所有笔画及顺序
        };
    },
    methods: {
        dropPoint(x, y) {
            let c = this.two.makeCircle(x, y, this.linewidth / 2);
            c.noStroke(); // 无笔锋
            c.fill = this.fill; // 设置填充颜色
            this.two.update();
            return c;
        },
    },
    mounted() {
        window.vm = this;

        let app = document.getElementById('app');
        this.two = new Two({
            // type: 'WebGLRenderer',
            // type: 'CanvasRenderer',
            type: 'SVGRenderer',
            fullscreen: true,
        }).appendTo(app);

        let start = null;
        let trace = []; // 记录一次笔画
        $('body').on('mousedown', () => {
            trace = [];
            globalThis.onmousemove = ({ x, y }) => {
                if (start === null) start = [x, y];
                else {
                    let point = this.dropPoint(x, y);
                    let line = this.two.makeLine(...start, x, y);
                    line.linewidth = this.linewidth;
                    line.stroke = this.fill;
                    this.two.update();
                    start = [x, y];
                    trace.push([point, line]);
                }
            };
        });
        ['mouseup', 'mouseleave'].forEach(it => {
            $('body').on(it, () => {
                globalThis.onmousemove = null;
                start = null;
                this.traces.push(trace);
            });
        });
        window.onkeypress = event => {
            let { ctrlKey, keyCode, key } = event;
            if (ctrlKey && keyCode === 26) { // ^Z
                let tmp = this.traces.pop();
                tmp.forEach(it => {
                    this.two.remove(it);
                });
                return this.two.update();
            }
            if (key === 'd') {
                this.two.clear();
                return this.two.update();
            }
        };
        window.onresize = event => {
            this.two.update(); // 画布尺寸变化, 及时更新, 否则出现空白画布
        };
    },
}
</script>

<style scoped>

</style>
