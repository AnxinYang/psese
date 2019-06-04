const cluster = require('cluster');
const os = require('os');


const config = require('./config');

const server = require('./lib/server');
const routines = require('./lib/routines');

const app = {
    init: function (config = {}) {
        return new Promise(function (resolve, reject) {
            if(config.cluster){
                app.initCluster(config)
                    .then(resolve);
            }else {
                server.init(config)
                    .then(routines.init)
                    .then(resolve);
            }
        })

    },
    initCluster: function (config) {
        return new Promise(function (resolve, reject) {
            if (cluster.isMaster) {
                routines.init(config)
                    .then(app.initFork)
                    .then(function () {
                        console.log('Master is Running...')
                    });
            } else {
                server.init(config);
            }
            resolve(config);
        })
    },
    initFork: function (config) {
        return new Promise(function (resolve, reject) {
            let maxCore = config.maxCluster || os.cpus().length;
            for(var i=0; i<maxCore; i++){
                cluster.fork();
            }
            resolve(config);
        })
    }
};

app.init(config);

module.exports= app;