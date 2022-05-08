module.exports = (server, db) => {

    server.post('/getDoctorDebtsDetails', (req, res) => {
        let ID = req.body.ID;
        let query = `SELECT * FROM film_invoice WHERE doctor_ID_FK = ${ID} AND record_status = 1 ORDER BY record_date DESC, record_time DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/getDoctorPaymentsDetails', (req, res) => {
        let ID = req.body.ID;
        let query = `SELECT * FROM doctor_payments WHERE doctor_ID_FK = ${ID} AND payment_status = true ORDER BY payment_ID DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/submitDoctorPayment', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO doctor_payments SET ?`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let sql = `UPDATE doctors SET doctor_debit = doctor_debit - ${data.payment_amount} WHERE doctor_ID = ${data.doctor_ID_FK}`;
                db.query(sql, function (error) {
                    if (error) {
                        res.status(400).send(error);
                    } else {
                        let sql = `SELECT * FROM doctor_payments WHERE payment_ID = ${results.insertId}`;
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

    server.post('/editDoctorPayment', (req, res) => {
        let data = req.body;
        let query = `UPDATE doctor_payments SET payment_amount = ${data.payment_amount}, payment_notes = '${data.payment_notes}' WHERE payment_ID = ${data.payment_ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(serror);
            } else {
                let sql = `UPDATE doctors SET doctor_debit = doctor_debit - (${data.payment_amount} - ${data.old_payment_amount}) WHERE doctor_ID = ${data.doctor_ID_FK}`;
                db.query(sql, function (error) {
                    if (error) {
                        res.status(400).send(serror);
                    } else {
                        let sql = `SELECT * FROM doctor_payments WHERE payment_ID = ${data.payment_ID} AND payment_status = true`;
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

    server.post('/deleteDoctorPayment', (req, res) => {
        let data = req.body;
        let query = `UPDATE doctor_payments SET payment_status = false WHERE payment_ID = ${data.payment_ID}`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let sql = `UPDATE doctors SET doctor_debit = doctor_debit + ${data.payment_amount} WHERE doctor_ID = ${data.doctor_ID_FK}`;
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

    server.get('/getTotalDoctorDebts', (req, res) => {
        let query = `SELECT SUM(remaining) AS remaining FROM debts WHERE item_type = 'Stock' AND debt_status = 1`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/updateDoctorDebit', (req, res) => {
        let ID = req.body.doctor_ID;
        let debitAmount = req.body.debitAmount;
        let method = req.body.method;
        let query;
        switch (method) {
            case 'add':
                query = `UPDATE doctors SET doctor_debit = doctor_debit + ${debitAmount} WHERE doctor_ID = ${ID}`;
                break;
            case 'substract':
                query = `UPDATE doctors SET doctor_debit = doctor_debit - ${debitAmount} WHERE doctor_ID = ${ID}`;
        }
        db.query(query, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query = `SELECT * FROM doctors WHERE doctor_status = 1`;
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

    server.get('/getDoctors', (req, res) => {
        let query = "SELECT * FROM doctors WHERE doctor_status = 1";
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    server.post('/addDoctor', (req, res) => {
        let data = req.body;
        data.doctor_status = true;
        let query = "INSERT INTO doctors SET ?";
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).end(error);
            } else {
                let sql = `SELECT * FROM doctors WHERE doctor_ID = ?`;
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

    server.post('/editDoctor', (req, res) => {
        let data = req.body;
        let query = `UPDATE doctors SET ? WHERE doctor_ID = ${data.doctor_ID}`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query = `SELECT * FROM doctors WHERE doctor_ID = ${data.doctor_ID}`;
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

    server.post('/deleteDoctor', (req, res) => {
        let query = `UPDATE doctors SET doctor_status = 0 WHERE doctor_ID = ${req.body.ID}`;
        db.query(query, function (err, results) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send({
                    doctor_ID: req.body.ID
                });
            }
        });
    });
}