module.exports = (server,db) => {

    server.post('/getSupplierDebtsDetails', (req, res) => {
        let ID = req.body.ID;
        let query = `SELECT i.*, JSON_ARRAYAGG(JSON_OBJECT('record_ID', d.record_ID, 'item_name', s.item_name, 'qty', d.quantity, 'cost', d.cost)) invoice_details FROM supply_invoice as i INNER JOIN supply_invoice_map as d ON i.record_ID = d.invoice_ID_FK INNER JOIN stock as s ON s.IID = d.item_ID_FK WHERE i.supplier_ID_FK = ${ID} AND i.record_status = 1 GROUP BY i.record_ID ORDER BY record_date DESC, record_time DESC`;
        db.query(query, function (error, results) {
            if (error) {
                console.log(error);
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/getSupplierPaymentsDetails', (req, res) => {
        let ID = req.body.ID;
        let query = `SELECT * FROM supplier_payments WHERE supplier_ID_FK = ${ID} AND payment_status = true ORDER BY payment_ID DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/submitSupplierPayment', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO supplier_payments SET ?`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let sql = `UPDATE suppliers SET supplier_debit = supplier_debit - ${data.payment_amount} WHERE supplier_ID = ${data.supplier_ID_FK}`;
                db.query(sql, function (error) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        let sql = `SELECT * FROM supplier_payments WHERE payment_ID = ${results.insertId}`;
                        db.query(sql, function (error, result) {
                            if (error) {
                                result.status(400).send(error);
                            } else {
                                res.send(result[0]);
                            }
                        });
                    }
                });
            }
        })
    });

    server.post('/editSupplierPayment', (req, res) => {
        let data = req.body;
        let query = `UPDATE supplier_payments SET payment_amount = ${data.payment_amount}, payment_notes = '${data.payment_notes}' WHERE payment_ID = ${data.payment_ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(serror);
            } else {
                let sql = `UPDATE suppliers SET supplier_debit = supplier_debit - (${data.payment_amount} - ${data.old_payment_amount}) WHERE supplier_ID = ${data.supplier_ID_FK}`;
                db.query(sql, function (error) {
                    if (error) {
                        res.status(400).send(serror);
                    } else {
                        let sql = `SELECT * FROM supplier_payments WHERE payment_ID = ${data.payment_ID} AND payment_status = true`;
                        db.query(sql, function (error, result) {
                            if (error) {
                                result.status(400).send(error);
                            } else {
                                res.send(result[0]);
                            }
                        });
                    }
                });
            }
        })
    });

    server.post('/deleteSupplierPayment', (req, res) => {
        let data = req.body;
        let query = `UPDATE supplier_payments SET payment_status = false WHERE payment_ID = ${data.payment_ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let sql = `UPDATE suppliers SET supplier_debit = supplier_debit + ${data.payment_amount} WHERE supplier_ID = ${data.supplier_ID_FK}`;
                db.query(sql, function (error, results) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send('');
                    }
                });
            }
        });
    });

    server.get('/getTotalSupplierDebts', (req, res) => {
        let query = `SELECT SUM(remaining) AS remaining FROM debts WHERE item_type = 'Stock' AND debt_status = 1`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/updateSupplierDebit', (req, res) => {
        let ID = req.body.supplier_ID;
        let debitAmount = req.body.debitAmount;
        let method = req.body.method;
        let query;
        switch (method) {
            case 'add':
                query = `UPDATE suppliers SET supplier_debit = supplier_debit + ${debitAmount} WHERE supplier_ID = ${ID}`;
                break;
            case 'substract':
                query = `UPDATE suppliers SET supplier_debit = supplier_debit - ${debitAmount} WHERE supplier_ID = ${ID}`;
        }
        db.query(query, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query = `SELECT * FROM suppliers WHERE supplier_status = 1`;
                db.query(query, function (error, results) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        res.send(results);
                    }
                });
            }
        });
    });

    server.get('/getSuppliers', (req, res) => {
        let query = "SELECT * FROM suppliers WHERE supplier_status = 1";
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/addSupplier', (req, res) => {
        let data = req.body;
        data.supplier_status = true;
        let query = "INSERT INTO suppliers SET ?";
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let sql = `SELECT * FROM suppliers WHERE supplier_ID = ?`;
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

    server.post('/editSupplier', (req, res) => {
        let data = req.body;
        let query = `UPDATE suppliers SET ? WHERE supplier_ID = ${data.supplier_ID}`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query = `SELECT * FROM suppliers WHERE supplier_ID = ${data.supplier_ID}`;
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

    server.post('/deleteSupplier', (req, res) => {
        let query = `UPDATE suppliers SET supplier_status = 0 WHERE supplier_ID = ${req.body.ID}`;
        db.query(query, function (err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send({
                    supplier_ID: req.body.ID
                });
            }
        });
    });

}