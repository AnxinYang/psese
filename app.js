const cluster = require('cluster');
const os = require('os');


const config = require('./config');

const server = require('./lib/server');
const routines = require('./lib/routines');

const app = {
    init: function (config = {}) {
        return new Promise(function (resolve, reject) {
            config.cluster === true ?
                app.initCluster(config)
                    .then(resolve)
                :
                server.init(config)
                    .then(routines.init)
                    .then(resolve);
        })

    },
    initCluster: function (config) {
        return new Promise(function (resolve, reject) {
            (cluster.isMaster ?
                routines.init(config)
                    .then(app.initClusters)
                    .then(function () {
                        console.log('Master is Running...')
                    })
                :
                server.init(config))
                .then(resolve);
        })
    },
    initClusters: function (config) {
        return new Promise(function (resolve, reject) {
            let maxCore = config.maxCluster || os.cpus().length;
            for(let i=0; i<maxCore; i++){
                cluster.fork();
            }
            resolve(config);
        })
    }
};

app.init(config);

module.exports= app;