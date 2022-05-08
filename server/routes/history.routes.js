module.exports = (server, db) => {

    server.get('/getSalesInvoices', (req, res) => {
        let date = req.query.date;
        let query = `SELECT i.*, c.customer_name, u.owner AS user, JSON_ARRAYAGG(JSON_OBJECT('record_ID', d.record_ID, 'item_ID_FK', d.item_ID_FK, 'item_name', s.item_name, 'qty', d.quantity, 'cost', d.cost, 'average_cost', d.average_cost, 'price', d.price)) invoice_details FROM invoice AS i INNER JOIN invoice_details AS d ON i.invoice_ID = d.invoice_ID_FK INNER JOIN stock AS s ON s.IID = d.item_ID_FK INNER JOIN users AS u ON i.UID_FK = u.UID LEFT JOIN customers AS c ON i.customer_ID_FK = c.customer_ID WHERE invoice_date = '${date}' AND invoice_status = 1 GROUP BY i.invoice_ID`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.get('/getSupplyInvoices', (req, res) => {
        let date = req.query.date;
        let query = `SELECT i.*, sup.supplier_name, JSON_ARRAYAGG(JSON_OBJECT('record_ID', d.record_ID, 'item_ID_FK', d.item_ID_FK, 'item_name', s.item_name, 'qty', d.quantity, 'cost', d.cost)) invoice_details FROM supply_invoice as i INNER JOIN supply_invoice_map as d ON i.record_ID = d.invoice_ID_FK INNER JOIN stock as s ON s.IID = d.item_ID_FK LEFT JOIN suppliers as sup ON i.supplier_ID_FK = sup.supplier_ID WHERE record_date = '${date}' AND i.record_status = 1 GROUP BY i.record_ID`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.get('/getTotalSales', (req, res) => {
        let date = req.query.date;
        let query = `SELECT SUM(invoice_total_cost) AS totalCost, SUM(invoice_total_price) AS totalPrice FROM invoice WHERE invoice_date = '${date}' AND invoice_status = 1`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.get('/totalStockInvoices', (req, res) => {
        let date = req.query.date;
        let query = `SELECT SUM(inv_total_cost) AS totalCost, SUM(inv_total_price) AS totalPrice FROM invoice WHERE inv_date = '${date}' AND inv_status = 1`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/deleteInvoice', (req, res) => {
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).send(error);
            }
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(500).send(error);
                }
                let tab = req.body.tab;
                let invoice = req.body.invoice;
                let items = invoice.invoice_details;
                switch (tab) {
                    case 0:
                        let InvoiceID = req.body.invoice.invoice_ID;
                        let query = `UPDATE invoice SET invoice_status = 0 WHERE invoice_ID = ${InvoiceID}`;
                        connection.query(query, function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    res.status(400).send(error);
                                });
                            } else {
                                let query2 = `UPDATE invoice_details SET record_status = 0 WHERE invoice_ID_FK = ${invoiceID}`;
                                connection.query(query2, function (error) {
                                    if (error) {
                                        connection.rollback(function () {
                                            connection.destroy();
                                            res.status(400).send(error);
                                        });
                                    } else {
                                        // update stock quantity
                                        let queries = '';
                                        let ID = null;
                                        let quantity = null;
                                        let cost = null;
                                        for (let i = 0; i < items.length; i++) {
                                            ID = items[i]['item_ID_FK'];
                                            quantity = items[i]['qty'];
                                            average_cost = items[i]['average_cost'];
                                            queries += `UPDATE stock SET average_cost = 
                                            ((item_qty * average_cost) + (${quantity} * ${average_cost}) ) / (item_qty + ${quantity}), 
                                            item_qty = (item_qty + ${quantity}) 
                                            WHERE IID = ${ID};`;
                                        }
                                        connection.query(queries, function (error) {
                                            if (error) {
                                                connection.rollback(function () {
                                                    connection.destroy();
                                                    res.status(400).send(error);
                                                });
                                            } else {
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
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        break;

                    case 1:
                        let recordID = invoice.record_ID;
                        let query2 = `UPDATE supply_invoice SET record_status = 0 WHERE record_ID = ${recordID}`;
                        connection.query(query2, function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    res.status(400).send(error);
                                });
                            } else {
                                let query3 = `UPDATE supply_invoice_map SET record_status = 0 WHERE invoice_ID_FK = ${recordID}`;
                                connection.query(query3, function (error) {
                                    if (error) {
                                        connection.rollback(function () {
                                            connection.destroy();
                                            res.status(400).send(error);
                                        });
                                    } else {
                                        // create multiple UPDATE statements
                                        let queries = '';
                                        let ID = null;
                                        let quantity = null;
                                        let cost = null;
                                        for (let i = 0; i < items.length; i++) {
                                            ID = items[i]['item_ID_FK'];
                                            quantity = items[i]['qty'];
                                            cost = items[i]['cost'];
                                            queries += `UPDATE stock SET average_cost = IF(item_qty - ${quantity} <= 0 , '0.00', (average_cost * item_qty - (${quantity} * ${cost}) ) / (item_qty - ${quantity})), item_qty = (item_qty - ${quantity}) WHERE IID = ${ID};`;
                                        }
                                        connection.query(queries, function (error) {
                                            if (error) {
                                                connection.rollback(function () {
                                                    connection.destroy();
                                                    res.status(400).send(error);
                                                });
                                            } else {
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
                                            }
                                        })
                                    }
                                })
                            }
                        });
                        break;
                }
            })
        });
    });
};