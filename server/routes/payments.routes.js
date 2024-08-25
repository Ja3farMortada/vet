module.exports = (server, db) => {

    function getAssets(res) {
        let query = `SELECT assets, dollar_assets FROM assets`;
        db.query(query, function(err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(results)
            }
        });
    }
    server.get('/getAssets', (req, res) => {
        getAssets(res);
    });

    server.get('/getTodaysTotalPayments', (req, res) => {
        let date = req.query.date;
        let query = `SELECT SUM(amount) AS payments FROM payments WHERE date = '${date}' AND payment_currency = 'lira' UNION ALL SELECT SUM(amount) FROM payments WHERE date = '${date}' AND payment_currency = 'dollar' `;
        db.query(query, function(err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(results)
            }
        });
    });

    server.post('/addMoney', (req, res) => {
        let data = req.body;
        console.log(data)
        let query;
        if (data.currency == 'lira') {
            query = `UPDATE assets SET assets = assets + ?`;
        } else {
            query = `UPDATE assets SET dollar_assets = dollar_assets + ?`;
        }
        // let query = `UPDATE assets SET assets = assets + ?`;
        db.query(query, data.amount, function(err) {
            if (err) {
                res.status(400).send(err);
            } else {
                getAssets(res);
            }
        });
    });

    server.post('/addPayment', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO payments SET ?`;
        db.query(query, data, function(err) {
            if (err) {
                res.status(400).send(err);
            } else {
                // update assets
                let query;
                if (data.payment_currency == 'lira') {
                    query = `UPDATE assets SET assets = assets - ?`;
                } else {
                    query = `UPDATE assets SET dollar_assets = dollar_assets - ?`
                }
                db.query(query, data.amount, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        getAssets(res);
                    }
                })
            }
        });
    });

    server.get('/getPayments', (req, res) => {
        let date1 = req.query.date1;
        let date2 = req.query.date2;
        let query = `SELECT * FROM payments WHERE date >= '${date1}' AND date <= '${date2}'`;
        db.query(query, function(err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(results)
            }
        });
    });
}