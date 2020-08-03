<template>
<div id="app">
    <button @click="test">Test</button>
</div>
</template>

<script>
import { ipcRenderer, } from 'electron';
const router = new VueRouter({});
export default {
    router,
    data() {
        return {
            i: 8,
        };
    },
    methods: {
        test() {
            ipcRenderer.send('test', ++this.i);
        }
    },
}
</script>

<style scoped>
#app {
    min-height: 100vh;
    background: #880088;
    color: white;
}
</style>