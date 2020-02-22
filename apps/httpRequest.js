const needle = require('needle');

get = function(url, next) {
    console.log(url);
    needle.get(url, function(err, resp) {
        if (err) {
            next(err);
        } else {
            next(resp.body);
        }
    });
}

post = function(url, data, next) {
    needle.post(url, data, function(err, resp) {
        if (err) {
            next(err);
        } else {
            next(resp.body);
        }
    });
}

exports.get = get;
exports.post = post;