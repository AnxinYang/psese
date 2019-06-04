const ENV = {
    dev:{
        envName: 'dev',
        hostname: 'localhost',
        httpPort: 3000,
        httpsPort: 3001,
        httpsKey: '',
        httpsCert: '',
        cluster: true,
        maxCluster: 0, // 0 for Max
    },
    production:{
        envName: 'production',
        hostname: 'localhost',
        httpPort: 5000,
        httpsPort: 5001,
        httpsKey: '',
        httpsCert: '',
        cluster: true,
        maxCluster: 0, // 0 for Max
    }
};

let currentENV = process.env.NODE_ENV || 'dev';

module.exports = ENV[currentENV] || ENV.dev;