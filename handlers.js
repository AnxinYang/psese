const handlers = {
    '404': function (data, callback) {
        return {
            statusCode: 404,
            error: 'Not found'
        }
    },
    foo: function (data, callback) {
        return {
            statusCode: 200,
            payload: 'OK'
        }
    }
};

module.exports = handlers;