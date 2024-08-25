const md5 = require("md5");

module.exports = (server, db) => {

    server.get('/getExchangeRate', (req, res) => {
        let query = "SELECT exchange_rate FROM assets";
        db.query(query, function (err, result) {
            if (err) {
                res.status(400).send(error);
            } else {
                res.send(result[0]);
            }
        });
    });

    server.post('/updateExchangeRate', (req, res) => {
        let query = `UPDATE assets SET exchange_rate = ?`;
        db.query(query, req.body.rate, function (err, result) {
            if (err) {
                res.status(400).send(error);
            } else {
                res.send(result);
            }
        });
    });

    server.get('/getCustomers', (req, res) => {
        let query = "SELECT * FROM customers WHERE customer_status = 1";
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/addCustomer', (req, res) => {
        let data = req.body;
        data.customer_status = true;
        let query = "INSERT INTO customers SET ?";
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let sql = `SELECT * FROM customers WHERE customer_ID = ?`;
                db.query(sql, results.insertId, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result[0])
                    }
                });
            }
        });
    });

    server.post('/editCustomer', (req, res) => {
        let data = req.body;
        let query = `UPDATE customers SET ? WHERE customer_ID = ${data.customer_ID}`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM customers WHERE customer_ID = ${data.customer_ID}`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/deleteCustomer', (req, res) => {
        let query = `UPDATE customers SET customer_status = 0 WHERE customer_ID = ${req.body.ID}`;
        db.query(query, function (err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send({
                    customer_ID: req.body.ID
                });
            }
        });
    });

    server.get('/getUsers', (req, res) => {
        let query = "SELECT * FROM users WHERE type != 'admin'";
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/editUsername', (req, res) => {
        let data = req.body;
        let query = `UPDATE users SET username = ? WHERE UID = ${data.ID}`;
        db.query(query, data.newUsername, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE UID = ${data.ID}`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/editPassword', (req, res) => {
        let ID = req.body.ID;
        let password = req.body.password;
        let hashPassword = md5(password);
        let query = `UPDATE users SET password = ? WHERE UID = ${ID}`;
        db.query(query, hashPassword, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query = `SELECT * FROM users WHERE UID = ${ID}`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).end(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/addUser', (req, res) => {
        let data = {
            username: req.body.username,
            password: md5(req.body.password),
            owner: req.body.owner
        }
        let query = `INSERT INTO users SET ?`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE UID = ${results.insertId}`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/editUser', (req, res) => {
        let data = req.body;
        let query = `UPDATE users SET username = ?, owner = ? WHERE UID = ${data.ID}`;
        db.query(query, [data.username, data.owner], function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE type = 'user'`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/deleteUser', (req, res) => {
        let query = `DELETE FROM users WHERE UID = ${req.body.ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE type = 'user'`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/updatePermissions', (req, res) => {
        let data = req.body;
        let query = `UPDATE users SET canAddService = ${data.canAddService}, canAddItem = ${data.canAddItem}, canViewCustomers = ${data.canViewCustomers}, canViewPayments = ${data.canViewPayments} WHERE UID = ${data.ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE type = 'user'`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

    server.post('/updateUserStatus', (req, res) => {
        let query = `UPDATE users SET user_status = !user_status WHERE UID = ${req.body.UID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let query = `SELECT * FROM users WHERE type = 'user'`;
                db.query(query, function (error, result) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });

};