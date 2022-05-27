const express = require('express');
const server = express();

const loginRoutes = require('./routes/login.routes');
const supplyRoutes = require('./routes/supply.routes');
const animalsRoutes = require('./routes/animals.routes');
const sellRoutes = require('./routes/sell.routes');
const stockRoutes = require('./routes/stock.routes');
const historyRoutes = require('./routes/history.routes');
const paymentsRoutes = require('./routes/payments.routes');
const suppliersRoutes = require('./routes/suppliers.routes');
const reportsRoutes = require('./routes/reports.routes');
const debtsRoutes = require('./routes/debts.routes');
const remindersRoutes = require('./routes/reminders.routes');
const settingsRoutes = require('./routes/settings.routes');

// require database
const connection = require('./database');

server.use(express.urlencoded({
    extended: false
}));
server.use(express.json());

loginRoutes(server, connection);
supplyRoutes(server, connection);
sellRoutes(server, connection);
animalsRoutes(server, connection);
stockRoutes(server, connection);
historyRoutes(server, connection);
paymentsRoutes(server, connection);
suppliersRoutes(server, connection);
reportsRoutes(server, connection);
debtsRoutes(server, connection);
remindersRoutes(server, connection);
settingsRoutes(server, connection);

module.exports = server;