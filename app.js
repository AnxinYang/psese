
const config = require('./config');

const server = require('./lib/server');
const routines = require('./lib/routines');

const app = {
    init: function (config = {}){
        server.init(config)
            .then(routines.init);

    },
};

app.init(config);

module.exports= app;