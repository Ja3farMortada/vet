app.factory('supplyFactory', ['$http', 'NotificationService', 'DateService', 'stockModel', 'stockFactory', function ($http, NotificationService, DateService, stockModel, stockFactory) {
    // define url
    const url = `http://${keys.host}:${keys.port}`;

    // define variables
    var model = {};
    model.invoice = [];
    model.selectedSupplier = null;
    model.invoiceDetails = {
        record_date: DateService.getDate(),
        record_time: DateService.getTime(),
        supplier_ID_FK: null,
        UID_FK: JSON.parse(localStorage.getItem('setting')).UID
    }
    

    // add to invoice
    model.addToInvoice = index => {
        if (index == -1) {
            NotificationService.showErrorText('Item is not defined!');
        } else {
            let selectedItem = stockFactory.items[index];
            let found = false;
            for (let j = 0; j < model.invoice.length; j++) {
                if (selectedItem.item_name == model.invoice[j]['name']) {
                    found = true;
                    model.invoice[j]['quantity'] += 1;
                    break;
                }
            }
            if (!found) {
                model.invoice.push({
                    ID: selectedItem['IID'],
                    barcode: selectedItem['barcode'],
                    name: selectedItem['item_name'],
                    currency: selectedItem['item_currency'],
                    cost: selectedItem['item_cost'],
                    quantity: 1
                });
            }
        }
    };

    // remove from invoice
    model.removeFromInvoice = function (index) {
        this.invoice.splice(index, 1);
        $('#itemsDataList').trigger('focus');
    };

    // calculate total price
    model.total = function () {
        return this.invoice.reduce(function (memo, item) { // memo is the reduced value initialized by object of zero values
            return {
                totalCost: memo.totalCost + (item.quantity * item.cost),
                totalPrice: memo.totalPrice + (item.quantity * item.price),
                totalLiraPrice: (memo.totalLiraPrice + (item.quantity * item.price) * stockModel.exchangeRate.exchange_rate)
            };
        }, {
            totalCost: 0,
            totalPrice: 0,
            totalLiraPrice: 0
        });
    };

    // clear invoice records
    model.clearInvoice = function () {
        this.invoice = [];
        this.selectedSupplier = null;
    };

    model.submitInvoice = invoice => {
        model.invoiceDetails.dollar_exchange = stockModel.exchangeRate.exchange_rate;
        model.invoiceDetails.total_cost = model.total().totalCost;
        return $http.post(`${url}/submitSupplyInvoice`, [model.invoiceDetails, invoice]).then(function (response) {
            NotificationService.showSuccess();
            return response;
        }, function (error) {
            NotificationService.showError(error);
        })
    }


    return model;
}]);