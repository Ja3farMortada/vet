app.factory('historyFactory', function ($http, NotificationService, DateService, stockFactory) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.datePickerValue = DateService.getDate();
    model.salesInvoices = [];
    model.servicesInvoices = [];
    model.totalSales = [];
    model.totalServices = [];
    
    //tab selection
    model.tabSelected = 0;
    model.selectTab = function (tab) {
        if (this.tabSelected != tab) {
            switch (tab) {
                case 0:
                    this.tabSelected = 0;
                    break;

                case 1:
                    this.tabSelected = 1;
                    break;
            };
        }
    };

    // get cached services invoices function
    const getSalesInvoices = () => {
        return $http.get(`${url}/getSalesInvoices`, {
            params: {
                "date": model.datePickerValue
            }
        }).then(function (response) {
            angular.copy(response.data, model.salesInvoices);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getSalesInvoices = getSalesInvoices();

    // fetch services invoices
    model.fetchSalesInvoices = date => {
        return $http.get(`${url}/getSalesInvoices`, {
            params: {
                "date": date
            }
        }).then(function (response) {
            angular.copy(response.data, model.salesInvoices);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // get cached stock invoices function
    const getServicesInvoices = () => {
        return $http.get(`${url}/getServicesInvoices`, {
            params: {
                "date": model.datePickerValue
            }
        }).then(function (response) {
            angular.copy(response.data, model.servicesInvoices);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    getServicesInvoices();

    // fetch stock invoices
    model.fetchServicesInvoices = date => {
        return $http.get(`${url}/getServicesInvoices`, {
            params: {
                "date": date
            }
        }).then(function (response) {
            angular.copy(response.data, model.servicesInvoices);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // delete invoice
    model.deleteInvoice = (invoice, tab, date) => {
        data = {
            'invoice': invoice,
            'tab': tab
        };
        return $http.post(`${url}/deleteInvoice`, data).then(function () {
            if (tab == 0) {
                if (invoice.customer_ID_FK) {
                    // DebtsFactory.updateCustomerDebit({
                    //     "customer_ID": invoice.customer_ID_FK,
                    //     "debitAmount": invoice.invoice_total_price,
                    //     "method": "substract"
                    // });
                    // DebtsFactory.getDebtsDetails(DebtsFactory.selectedID);
                }
                model.fetchSalesInvoices(date);
            }
            stockFactory.fetchItems();
            NotificationService.showSuccessToast();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    return model;
});