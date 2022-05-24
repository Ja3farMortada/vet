module.exports = (server, db) => {

    server.get('/getItems', (req, res) => {
        let query = "SELECT * FROM `stock` WHERE `item_status` = ?";
        db.query(query, [true], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.get('/getTotalStock', (req, res) => {
        let query = "SELECT SUM(item_qty) AS total_qty, SUM(item_cost * item_qty) AS total_cost, SUM(item_price * item_qty) AS total_price FROM stock WHERE item_status = ?";
        db.query(query, [true], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/addItem', (req, res) => {
        let item = req.body;
        item.item_status = true;

        let query = `INSERT INTO stock SET ?`;
        db.query(query, item, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let sql = "SELECT * FROM `stock` WHERE `IID` = ? ";
                db.query(sql, results.insertId, function (error, results) {
                    if (error) {
                        results.status(400).send(error);
                    } else {
                        res.send(results[0]);
                    }
                });
            }
        });
    });

    server.post('/editItem', (req, res) => {
        let item = req.body;
        let query = `UPDATE stock SET ? WHERE IID = ${item.IID}`;
        db.query(query, item, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/deleteItem', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE stock SET item_status = false where IID = ?`;
        db.query(query, ID, function(error) {
            if(error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });
}