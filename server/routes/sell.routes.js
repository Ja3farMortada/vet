module.exports = (server, db) => {

    server.post('/addInvoice', (req, res) => {
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(500).send(error);
            }
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(500).send(error);
                }
                let order = req.body.invoice;
                let items = req.body.items;
                // // place new order
                let orderQuery = `INSERT INTO invoice SET ?`;
                connection.query(orderQuery, order, function (error, result) {
                    if (error) {
                        connection.rollback(function () {
                            connection.destroy();
                            res.status(400).send(error);
                        });
                    }
                    // invoice_details items
                    let invoice_ID = result.insertId;
                    let invoice_details = Array.from(items).map(function (item) {
                        return [invoice_ID, item.ID, item.quantity, item.cost, item.average_cost, item.price]
                    });
                    let detailsQuery = `INSERT INTO invoice_details (invoice_ID_FK, item_ID_FK, quantity, cost, average_cost, price) VALUES ?`;
                    connection.query(detailsQuery, [invoice_details], function (error) {
                        if (error) {
                            connection.rollback(function () {
                                connection.destroy();
                                res.status(400).send(error);
                            });
                        }
                        // update stock quantity
                        let queries = '';
                        let ID = null;
                        let quantity = null;
                        for (let i = 0; i < items.length; i++) {
                            ID = items[i]['ID'];
                            quantity = items[i]['quantity'];
                            queries += `UPDATE stock SET item_qty = (item_qty - ${quantity}) WHERE IID = ${ID};`;
                        }
                        connection.query(queries, function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    res.status(400).send(error);
                                });
                            }
                            connection.commit(function (error) {
                                if (error) {
                                    connection.rollback(function () {
                                        connection.destroy();
                                        res.status(400).send(error);
                                    });
                                }
                                connection.release();
                                res.send('');
                            });
                        })
                    })
                })
            })
        })
    });
};