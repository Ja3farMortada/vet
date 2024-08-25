module.exports = (server, db) => {

    server.post('/submitSupplyInvoice', (req, res) => {
        // get connection from pool
        db.getConnection(function (err, connection) {
            if (err) {
                res.status(400).send(error);
            }
            // Start Transaction
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(400).send(error);
                }
                // add invoice query
                let invoice = req.body[0];
                let items = req.body[1];
                let invoiceQuery = `INSERT INTO supply_invoice SET ?`;
                connection.query(invoiceQuery, invoice, function (error, result) {
                    if (error) {
                        connection.rollback(function () {
                            connection.destroy();
                            res.status(400).send(error);
                        });
                    }
                    // Insert items into supply_invoice_map
                    let invoice_ID = result.insertId;
                    let items_map = Array.from(items).map(function (item) {
                        return [invoice_ID, item.ID, item.quantity, item.cost, item.currency]
                    });
                    let mapQuery = `INSERT INTO supply_invoice_map (invoice_ID_FK, item_ID_FK, quantity, cost, currency) VALUES ?`;
                    connection.query(mapQuery, [items_map], function (error) {
                        if (error) {
                            connection.rollback(function () {
                                connection.destroy();
                                res.status(400).send(error);
                            });
                        }
                        // create multiple UPDATE statements to update quantity
                        let queries = '';
                        let ID = null;
                        let quantity = null;
                        let cost = null;
                        for (let i = 0; i < items.length; i++) {
                            ID = items[i]['ID']
                            quantity = items[i]['quantity']
                            cost = items[i]['cost']
                            queries += `UPDATE stock SET average_cost = 
                            ((item_qty * average_cost) + (${quantity} * ${cost}) ) / (item_qty + ${quantity}), 
                            item_qty = (item_qty + ${quantity}) 
                            WHERE IID = ${ID};`;
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
                                connection.destroy();
                                res.send('');
                            });
                        });
                    });
                });
            });
        });
    });

}