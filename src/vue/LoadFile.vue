<template>
<div id="app">
    <button @click="test">加载文件</button>
    <button @click="pop">弹出文件</button>
    <div>
        <li v-for="(f, index) in files" :key="index">{{f}}</li>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
        };
    },
    methods: {
        pop() {
            this.files.pop();
        },
        test() {
            this.popFileSelector().then(fc => {
                console.log(fc);
            });
        },
        popFileSelector() {
            return new Promise((resolve, reject) => {
                let input = document.createElement('input');
                input.value = '选择文件';
                input.type = 'file';
                input.onchange = event => {
                    let file = event.target.files[0];
                    let file_reader = new FileReader();
                    file_reader.onload = () => {
                        let fc = file_reader.result;
                        resolve(fc); // 返回文件文本内容到Promise
                    };
                    file_reader.readAsText(file, 'UTF-8');
                    this.files.push(file.name);
                };
                input.click();
            });
        },
    },
}
</script>

<style scoped>
#app>button:nth-child(1) {
    color: red;
}
</style>
