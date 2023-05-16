app.factory('sellFactory', ['$http', 'stockModel', function ($http, stockModel) {

    var model = {};
    model.invoice = [];
    model.isLira = false;

    // toggle to dollar
    model.toggleCurrency = () => {
        model.isLira = !model.isLira;
    };

    model.addToInvoice = function (item) {
        this.invoice.push(item);
    };

    model.removeFromInvoice = function (index) {
        this.invoice.splice(index, 1);
        $('#itemsDataList').trigger('focus');
    };

    model.total = function () {
        return this.invoice.reduce(function (memo, item) { // memo is the reduced value initialized by object of zero values
            return {
                totalCost: memo.totalCost + (item.quantity * item.cost),
                averageCost: memo.averageCost + (item.quantity * item.average_cost),
                totalPrice: memo.totalPrice + (item.quantity * item.price),
                totalLiraPrice: (memo.totalLiraPrice + (item.quantity * item.price) * stockModel.exchangeRate.exchange_rate)
            };
        }, {
            totalCost: 0,
            totalPrice: 0,
            averageCost: 0,
            totalLiraPrice: 0
        });
    };

    model.clearInvoice = function () {
        this.invoice = [];
    };

    return model;
}]);