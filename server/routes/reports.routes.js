module.exports = (server, db) => {

    server.post('/getSalesReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        // let supplier_ID = req.body.supplier_ID;
        let query = '';

        query = `SELECT 'sales' AS type, ROUND(SUM(invoice.invoice_total_cost), 2) AS total_cost, ROUND(SUM(invoice.invoice_total_price), 2) AS total_sales FROM invoice WHERE invoice.invoice_date >= ? AND invoice.invoice_date <= ? AND invoice.invoice_status = 1`;
        db.query(query, [startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results)
            }
        });
    });

    server.post('/getTotalPayments', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let supplier_ID = req.body.supplier_ID;
        let querySuffix = '';
        if (supplier_ID) {
            querySuffix = `AND supplier_ID_FK = ${supplier_ID}`;
        }
        let query = `SELECT 'customer' AS type, SUM(payment_amount) AS totalPayments FROM customer_payments WHERE payment_date >= ? AND payment_date <= ? AND payment_status = 1
        UNION SELECT 'supplier', SUM(payment_amount) FROM supplier_payments WHERE payment_date >= ? AND payment_date <= ? AND payment_status = 1 ${querySuffix}`;
        db.query(query, [startDate, endDate, startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results)
            }
        });
    });

    server.post('/topSalesReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT stock.item_name AS items, SUM(d.quantity) AS count
                        FROM invoice_details AS d INNER JOIN stock ON d.item_ID_FK = stock.IID
                        WHERE d.invoice_ID_FK IN (SELECT i.invoice_ID FROM invoice AS i WHERE i.invoice_date >= ? AND i.invoice_date <= ? AND i.invoice_status = 1)
                        GROUP BY stock.item_name ORDER BY count DESC limit 5 `;
        db.query(query, [startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    //topServicesReport
    server.post('/topServicesReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT service_type AS services, COUNT(service_type) AS count, SUM(payment_received) AS total FROM services WHERE service_date >= ? AND service_date <= ? AND service_status = 1 GROUP BY service_type UNION SELECT treatment_type, COUNT(treatment_type), SUM(payment_received) FROM treatments WHERE treatment_date >= ? AND treatment_date <= ? AND treatment_status = 1 GROUP BY treatment_type ORDER BY count DESC LIMIT 5`;
        db.query(query, [startDate, endDate, startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    // getAnimalsReport in lira
    server.post('/getAnimalsReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT IFNULL(SUM(payment_received), 0) AS total FROM services WHERE service_date >= ? AND service_date <= ? AND service_status = 1 AND payment_currency = 'lira' UNION SELECT IFNULL(SUM(payment_received), 0) FROM treatments WHERE treatment_date >= ? AND treatment_date <= ? AND treatment_status = 1 AND payment_currency = 'lira'`;
        db.query(query, [startDate, endDate, startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                // console.log(results);
                res.send(results);
            }
        });
    });

    // get Animals Report in dollar
    server.post('/getAnimalsReportDollar', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT IFNULL(SUM(payment_received), 0) AS total FROM services WHERE service_date >= ? AND service_date <= ? AND service_status = 1 AND payment_currency = 'dollar' UNION ALL SELECT IFNULL(SUM(payment_received), 0) FROM treatments WHERE treatment_date >= ? AND treatment_date <= ? AND treatment_status = 1 AND payment_currency = 'dollar' `;
        db.query(query, [startDate, endDate, startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });
}