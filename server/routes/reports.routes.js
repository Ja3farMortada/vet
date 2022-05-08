module.exports = (server, db) => {

    server.post('/getSalesReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let supplier_ID = req.body.supplier_ID;
        let query = '';
        if (supplier_ID) {
            query = `SELECT 'sales' AS type, ROUND(SUM(average_cost * quantity), 2) AS total_cost, ROUND(SUM(price * quantity), 2) AS total_sales FROM invoice_details WHERE supplier_ID_FK = ${supplier_ID} AND invoice_ID_FK IN (SELECT invoice_ID FROM invoice WHERE invoice.invoice_date >= ? AND invoice.invoice_date <= ? AND invoice.invoice_status = 1)
            UNION SELECT 'debts', ROUND(SUM(average_cost * quantity), 2), ROUND(SUM(price * quantity), 2) FROM invoice_details WHERE supplier_ID_FK = ${supplier_ID} AND invoice_ID_FK IN (SELECT invoice_ID FROM invoice WHERE invoice.invoice_date >= ? AND invoice.invoice_date <= ? AND invoice.invoice_status = 1 AND customer_ID_FK IS NOT NULL)
            UNION SELECT 'supply', ROUND(SUM(cost * quantity), 2), NULL FROM supply_invoice_map WHERE invoice_ID_FK IN (SELECT record_ID FROM supply_invoice WHERE record_date  >= ? AND record_date <= ? AND record_status = 1 AND supplier_ID_FK = ${supplier_ID})`
        } else {
            query = `SELECT 'sales' AS type, ROUND(SUM(invoice.total_average_cost), 2) AS total_cost, ROUND(SUM(invoice.invoice_total_price), 2) AS total_sales FROM invoice WHERE invoice.invoice_date >= ? AND invoice.invoice_date <= ? AND invoice.invoice_status = 1

            UNION SELECT 'debts', ROUND(SUM(invoice.total_average_cost), 2), ROUND(SUM(invoice.invoice_total_price), 2) FROM invoice WHERE customer_ID_FK IS NOT NULL AND invoice.invoice_date >= ? AND invoice.invoice_date <= ? AND invoice.invoice_status = 1
            
             UNION SELECT 'supply', ROUND(SUM(SI.total_cost), 2), NULL FROM supply_invoice AS SI WHERE SI.record_date  >= ? AND SI.record_date <= ? AND SI.record_status = 1`;
        }
        db.query(query, [startDate, endDate, startDate, endDate, startDate, endDate], function (error, results) {
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

    //topSuppliesReport
    server.post('/topSuppliesReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT stock.item_name AS items, SUM(d.quantity) AS count
                        FROM supply_invoice_map AS d INNER JOIN stock ON d.item_ID_FK = stock.IID
                        WHERE d.invoice_ID_FK IN (SELECT i.record_ID FROM supply_invoice AS i WHERE i.record_date >= ? AND i.record_date <= ? AND i.record_status = 1)
                        GROUP BY stock.item_name ORDER BY count DESC limit 5 `;
        db.query(query, [startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results);
            }
        });
    });

    // getPanoramicReport
    server.post('/getPanoramicReport', (req, res) => {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let query = `SELECT CONVERT(SUM(record_value), UNSIGNED INTEGER) AS totalSales, CONVERT(SUM(doctor_fee), UNSIGNED INT) AS doctorsFees FROM film_invoice WHERE record_date >= ? AND record_date <= ? AND record_status = 1`;
        db.query(query, [startDate, endDate], function (error, results) {
            if (error) {
                res.status(400).send(error);
            } else {
                res.send(results[0]);
            }
        });
    });
}