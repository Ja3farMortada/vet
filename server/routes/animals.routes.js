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


    //fetchTreatmentHistory
    server.get('/fetchTreatmentHistory', (req, res) => {
        let ID = req.query.ID;
        let query = `SELECT * FROM treatments WHERE animal_ID_FK = ? AND treatment_status = 1 ORDER BY treatment_date, treatment_time ASC`;
        db.query(query, ID, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    //fetchServiceHistory
    server.get('/fetchServiceHistory', (req, res) => {
        let ID = req.query.ID;
        let query = `SELECT * FROM services WHERE animal_ID_FK = ? AND service_status = 1 ORDER BY service_date, service_time ASC`;
        db.query(query, ID, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    // fetch reminders
    server.get('/fetchAnimalReminders/:id', (req, res) => {
        let ID = req.params.id;
        let query = `SELECT * FROM reminders WHERE animal_ID_FK = ? AND reminder_status = 1 ORDER BY due_date DESC, due_time DESC`;
        db.query(query, ID, function(error, results) {
            if (error) {
                res.status(400).send(error)
            } else {
                res.send(results)
            }
        })
    })

    // addNewFilm
    server.post('/newTreatment', (req, res) => {
        let data = req.body.data;

        let treatmentData = {
            animal_ID_FK: data.animal_ID_FK,
            treatment_type: data.treatment_type,
            treatment_description: data.treatment_description,
            treatment_notes: data.treatment_notes,
            payment_currency: data.payment_currency,
            payment_received: data.payment_received,
            exchange_rate: data.exchange_rate,
            treatment_date: data.treatment_date,
            treatment_time: data.treatment_time
        };

        let reminderData = {
            reminder_title: `${data.treatment_type} for ${data.animal_name}, Owner: ${data.owner_name}, Phone: ${data.owner_phone}`,
            reminder_text: data.reminder_notes,
            reminder_type: 'notification',
            due_date: data.reminder_date,
            due_time: '12:00:00',
            repeat_reminder: null
        }

        db.getConnection(function (error, connection) {
            if (error) {
                res.status(500).send(error);
            }
            connection.beginTransaction(function (error) {
                if (error) {
                    connection.destroy();
                    res.status(500).send(error);
                } else {
                    let query = `INSERT INTO treatments SET ?`;
                    connection.query(query, treatmentData, function (error, result) {
                        if (error) {
                            connection.rollback(function () {
                                connection.destroy();
                                res.status(400).send(error);
                            });
                        } else {
                            // let response = result;
                            if (data.has_reminder) {
                                let query2 = `INSERT INTO reminders SET ?`;
                                connection.query(query2, reminderData, function (error) {
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
                            } else {
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
                            }
                        }
                    })
                }
            })
        })
    })

    server.post('/newService', (req, res) => {
        let data = req.body.data;
        let query = `INSERT INTO services SET ?`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    });

    // delete treatment
    server.post('/deleteTreatment', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE treatments SET treatment_status = 0 WHERE treatment_ID = ?`;
        db.query(query, ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    });

    // editTreatment
    server.post('/editTreatment', (req, res) => {
        let data = req.body.data;
        let query = `UPDATE treatments SET ? WHERE treatment_ID = ${data.treatment_ID}`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    });


    // delete service
    server.post('/deleteService', (req, res) => {
        let ID = req.body.ID;
        let query = `UPDATE services SET service_status = 0 WHERE service_ID = ?`;
        db.query(query, ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    });

    // editservice
    server.post('/editService', (req, res) => {
        let data = req.body.data;
        let query = `UPDATE services SET ? WHERE service_ID = ${data.service_ID}`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send('');
            }
        })
    });

};