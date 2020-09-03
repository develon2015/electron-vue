import Index from './Index.vue';

let config = {
    mode: 'hash',
    routes: [],
};

function load(path) {
    let component = require(`./vue/${path}.vue`).default;
    config.routes.push({
        path: '/' + path,
        component,
    })
}

function loadAll(...paths) {
    paths.forEach(it => load(it));
}

function setupIndex() {
    config.routes.push({
        path: '/',
        component: Index,
    });
}

loadAll('Modal', 'Two', 'Three', 'LoadFile', 'Worker', 'GeoJSON');
setupIndex();

// export router config
let router = new VueRouter(config);
export default router;