const handlers = {
    '404': function (data) {
        return {
            statusCode: 404,
            error: 'Not found'
        }
    },
    ping: function (data) {
        return {
            statusCode: 200,
            payload: 'OK'
        }
    },
};

module.exports = handlers;