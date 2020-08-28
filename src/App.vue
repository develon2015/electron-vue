<template>
<div>
    <div class="page-home">
        <router-link class="link-home" to="/">Home</router-link>
    </div>
    <router-view></router-view>
</div>
</template>

<script>
import router from './router';
console.log({router});

Vue.use(VueRouter);
export default {
    router,
}
</script>

<style>
.link-home {
    color: green;
    font-size: 28px;
    position: relative;
    bottom: 0;
    left: -50%;
    /* transform: translateX(-50%); */
}
.link-home:hover {
    color: red;
    text-decoration: none;
}
.page-home {
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 99999;
}
</style>
