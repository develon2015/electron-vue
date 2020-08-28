<template>
<div>
    This is index
    <div class="list" v-for="(v, index) in routes" :key="index">
        <router-link :to="v.path">{{ v.path }}</router-link>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            routes: null,
        };
    },
    mounted() {
        this.routes = this.$router.options.routes;
    },
}
</script>

<style scoped>
.list {
    font-size: 28px;
}
</style>
