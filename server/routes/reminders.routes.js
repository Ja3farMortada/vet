module.exports = (server, db) => {

    //get reminders function
    function getReminders(res) {
        let query = `SELECT R.*, A.animal_name, A.owner_name, A.owner_phone
        FROM reminders R
        LEFT JOIN animals A ON R.animal_ID_FK = A.animal_ID
        WHERE reminder_status = 1 ORDER BY due_date DESC, due_time DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    }

    // get reminders API
    server.get('/getReminders', (req, res) => {
        getReminders(res);
    });

    // add reminder API
    server.post('/addReminder', (req, res) => {
        let data = req.body;
        let query = `INSERT INTO reminders SET ?`;
        db.query(query, data, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                getReminders(res);
            }
        });
    });

    // edit reminder API
    server.post('/editReminder', (req, res) => {
        let data = req.body;
        delete data.animal_name;
        delete data.owner_name;
        delete data.owner_phone;
        let query = `UPDATE reminders SET ? WHERE reminder_ID = ${data.reminder_ID}`;
        db.query(query, data, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                getReminders(res);
            }
        });
    });

    // remove reminder
    server.post('/removeReminder', (req, res) => {
        let data = req.body;
        let query;
        if (data.repeat_reminder) {
            query = `UPDATE reminders SET due_date = DATE_ADD(due_date, INTERVAL ${data.repeat_reminder} DAY) WHERE reminder_ID = ?`;
        } else {
            query = `UPDATE reminders SET reminder_status = false WHERE reminder_ID = ?`;
        }
        db.query(query, data.reminder_ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                getReminders(res);
            }
        });
    });

    // delete reminder
    server.post('/deleteReminder', (req, res) => {
        let data = req.body;
        let query = `UPDATE reminders SET reminder_status = 0 WHERE reminder_ID = ?`;
        db.query(query, data.reminder_ID, function (error) {
            if (error) {
                res.status(400).send(error);
            } else {
                getReminders(res);
            }
        });
    });

    // get upcoming reminders
    server.get('/getUpcomingReminders', (req, res) => {
        let query = `SELECT R.*, A.animal_name, A.owner_name, A.owner_phone
        FROM reminders R
        INNER JOIN animals A ON R.animal_ID_FK = A.animal_ID
        WHERE reminder_type = 'notification' AND reminder_status = 1 AND due_date < DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY) ORDER BY due_date DESC, due_time DESC`;
        db.query(query, function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    })
}