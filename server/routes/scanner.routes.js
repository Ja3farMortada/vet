module.exports = (server, db) => {

    // get invoices
    server.get('/getFilmInvoices', (req, res) => {
        let date = req.query.date;
        let query = `SELECT f.*, d.doctor_name FROM film_invoice AS f LEFT JOIN doctors AS d ON doctor_ID_FK = doctor_ID WHERE f.record_status = 1 AND f.record_date = ? ORDER BY f.record_time DESC`;
        db.query(query, date, function (error, results) {
            if (error) {
                res.status(400).send(error);
            }
            res.send(results);
        })
    })


    // addNewFilm
    server.post('/addNewFilm', (req, res) => {
        let data = req.body;
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).send(error);
            }
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(500).send(error);
                }
                let query = `INSERT INTO film_invoice SET ?`;
                connection.query(query, data, function (error) {
                    if (error) {
                        connection.rollback(function () {
                            connection.destroy();
                            res.status(400).send(error);
                        });
                    } else {
                        let query2 = `UPDATE settings SET value = value - 1 WHERE setting_ID = 1`;
                        connection.query(query2, function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    res.status(400).send(error);
                                });
                            }
                            if (data.doctor_ID_FK) {
                                let query3 = `UPDATE doctors SET doctor_debit = doctor_debit + ${data.doctor_fee} WHERE doctor_ID = ${data.doctor_ID_FK}`;
                                connection.query(query3, function (error) {
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
                                })
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
            })
        })
    })

    server.get('/getSettings', (req, res) => {
        let query = `SELECT * FROM settings`;
        db.query(query, function (error, result) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(result)
            }
        })
    })

    server.post('/addFilms', (req, res) => {
        let query = `UPDATE settings SET value = 149 WHERE setting_ID = 1`;
        db.query(query, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('')
            }
        })
    })

    server.post('/editSettings', (req, res) => {
        let value = req.body.value;
        let ID = req.body.ID
        let query = `UPDATE settings SET value = ? WHERE setting_ID = ${ID}`;
        db.query(query, value, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('')
            }
        })
    })

    // delete film 
    server.post('/deleteFilmInvoice', (req, res) => {
        let data = req.body;
        // let query  = `UPDATE film_invoice SET record_status = 0 WHERE record_ID = ${ID}`;
        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).send(error);
            }
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(500).send(error);
                }
                let query = `UPDATE film_invoice SET record_status = 0 WHERE record_ID = ${data.ID}`;
                connection.query(query, data, function (error) {
                    if (error) {
                        connection.rollback(function () {
                            connection.destroy();
                            res.status(400).send(error);
                        });
                    } else {
                        let query2 = `UPDATE settings SET value = value + 1 WHERE setting_ID = 1`;
                        connection.query(query2, function (error) {
                            if (error) {
                                connection.rollback(function () {
                                    connection.destroy();
                                    res.status(400).send(error);
                                });
                            }
                            if (data.doctor_ID_FK) {
                                let query3 = `UPDATE doctors SET doctor_debit = doctor_debit - ${data.doctor_fee} WHERE doctor_ID = ${data.doctor_ID_FK}`;
                                connection.query(query3, function (error) {
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
                                })
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
            })
        })
    })
};