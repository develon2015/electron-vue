const fs = require('fs');
const child_process = require('child_process');
const _ = require('lodash');

const rules = [
    { event: 'change', test: /^main\.js$/ },
];

fs.watch(__dirname, {}, (event, filename) => {
    rules.forEach(it => {
        if (event === it.event && it.test.test(filename)) {
            _handler(event, filename);
        }
    });
});

const _handler = _.debounce(handler, 800, { leading: true, trailing: false, });

function handler(event, filename) {
    if (global.electron) {
        global.electron.kill();
    }
    console.log(cmd);
    global.electron = child_process.exec(cmd);
}

const cmd = `start cmd /c electron ${__dirname}/main.js`; // Windows implement

handler();