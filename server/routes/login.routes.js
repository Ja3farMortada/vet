module.exports = (server, db) => {
    const md5 = require('md5');

    server.post('/login', (req, res) => {
        
        let query = "SELECT * FROM `users` WHERE `username` = ? AND `password` = ? AND `user_status` = ? ";

        db.query(query, [req.body.username, md5(req.body.password), true], function (error, results) {            
            if (error) {
                if (error.errno === 'ECONNREFUSED') {
                    res.status(400).send("MY SQL server is not running");
                } else {
                    res.status(400).send(error);
                }
            } else {
                res.send(results);
            }
        });
    });
};