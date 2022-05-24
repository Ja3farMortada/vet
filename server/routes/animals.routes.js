module.exports = (server, db) => {

    // get invoices
    server.get('/getAnimals', (req, res) => {
        let query = `SELECT * FROM animals WHERE animal_status = 1 ORDER BY animal_ID DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        })
    })

    // add animal
    server.post('/addAnimal', (req, res) => {
        let data = req.body.data;
        let query = `INSERT INTO animals SET ?`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                let query2 = `SELECT * FROM animals WHERE animal_ID = ${results.insertId}`;
                db.query(query2, function (err, result) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.send(result[0]);
                    }
                })
            }
        })
    })

    // edit animal
    server.post('/editAnimal', (req, res) => {
        let data = req.body.data;
        let query = `UPDATE animals SET ? WHERE animal_ID = ${data.animal_ID}`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

    // delete animal
    server.post('/deleteAnimal', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE animals SET animal_status = false WHERE animal_ID = ?`;
        db.query(query, ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        });
    });

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