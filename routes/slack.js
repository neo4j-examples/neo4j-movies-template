exports.receive = function (req, res, next) {
    console.log(req.body);
    console.log(req.body["challenge"]);
    res.send(req.body["challenge"]);
    next();
};