<template>
<!-- Three.js 3D动画演示 帧率计算 -->
<div ref="app" id="app">
    <div id="frame"></div>
</div>
</template>

<script>
import * as THREE from 'three';

export default {
    data() {
        return {
            height: 0,
            width: 0,
            z: 5,
            scene: null,
            camera: null,
            geometry: null,
            renderer: null,
            color: 0xff0000,
            material: null,
            cube: null,
            frame: 0,
            frame_start: null,
            frame_count: 0,
            doRender: false,
        };
    },
    methods: {
        /**
         * 场景渲染函数
         */
        render() {
            if (this.doRender) requestAnimationFrame(this.render);
            [this.height, this.width] = [this.$refs.app.clientHeight, this.$refs.app.clientWidth];
            this.renderer.setSize(this.width, this.height);
            this.material.setValues({
                color: this.color,
            });
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
            this.camera.position.z = this.z;

            // 计算刷新帧率
            if (this.frame_start === null) this.frame_start = new Date();
            let frame_end = new Date();
            let time = frame_end - this.frame_start;
            if (time > 100) {
                this.frame = this.frame_count;
                this.frame_count = 0;
                this.frame_start = frame_end;
                $('#frame').html(`<span style="color: white">Frame: ${this.frame * 10}</span>`);
            }

            this.frame_count++;
            this.renderer.render(this.scene, this.camera);
        },
    },
    mounted() {
        window.vm = this;
        this.doRender = true;
        [this.height, this.width] = [this.$refs.app.clientHeight, this.$refs.app.clientWidth];
        this.scene = new THREE.Scene(); // 场景
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000); // 相机
        this.renderer = new THREE.WebGLRenderer(); // 渲染器
        this.$refs.app.appendChild(this.renderer.domElement); // 将渲染器挂载到DOM
        this.geometry = new THREE.BoxGeometry(); // 实例化几何体, 立方体
        this.material = new THREE.MeshBasicMaterial({ // 材质
            color: this.color,
        });
        this.cube = new THREE.Mesh(this.geometry, this.material); // 网格, 封装几何体及其材质
        this.scene.add(this.cube); // 将网格添加进场景

        this.render();
    }, // mounted()
    destroyed() {
        this.doRender = false;
    }
}
</script>

<style scoped>
#app {
    width: 100vw;
    height: 100vh;
}

#frame {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
}
</style>
