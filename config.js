const ENV = {
    dev:{
        envName: 'dev',
        httpPort: 3000,
        httpsPort: 3001,
        httpsKey: '',
        httpsCert: '',
    },
    production:{
        envName: 'production',
        httpPort: 5000,
        httpsPort: 5001,
        httpsKey: '',
        httpsCert: '',
    }
};

let currentENV = process.env.NODE_ENV || 'dev';

module.exports = ENV[currentENV] || ENV.dev;