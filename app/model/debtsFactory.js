app.factory('DebtsFactory', function ($http, NotificationService, customersFactory) {

    // define url
    const url = `http://localhost:3000`;

    var model = {};
    model.customerDebts = [];
    model.selectedDebtsDetails = [];
    model.selectedPaymentDetails = [];
    model.totalDebts = [];
    model.activeRow = null;
    model.selectedID = {
        ID: null
    };
    model.sortData = {
        key: 'customer_debit',
        reverse: true
    }

    model.sort = keyname => {
        model.sortData.key = keyname;
        model.sortData.reverse = !model.sortData.reverse;
    }

    model.getDebtsDetails = ID => {
        return $http.post(`${url}/getDebtsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedDebtsDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.getPaymentDetails = ID => {
        return $http.post(`${url}/getPaymentsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedPaymentDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    const getTotalDebts = function () {
        return $http.get(`${url}/getTotalDebts`).then(function (response) {
            angular.copy(response.data, model.totalDebts);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getTotalDebts = getTotalDebts();

    model.submitPayment = function (data) {
        return $http.post(`${url}/submitCustomerPayment`, data).then(function (response) {
            $('#receivePaymentModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.editPayment = function (data) {
        return $http.post(`${url}/editCustomerPayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.deletePayment = function (data) {
        return $http.post(`${url}/deletePayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.updateCustomerDebit = function (data) {
        return $http.post(`${url}/updateCustomerDebit`, data).then(function (response) {
            angular.copy(response.data, customersFactory.customers);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    return model;
});