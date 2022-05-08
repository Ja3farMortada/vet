app.factory('customersFactory', ['$http', 'NotificationService', function ($http, NotificationService) {

    // define URL
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.customers = [];

    const getCustomers = function () {
        return $http.get(`${url}/getCustomers`).then(function (response) {
            angular.copy(response.data, model.customers);
        }, function (error) {
            NotificationService.showError(error.status);
        });
    };
    model.getCustomers = getCustomers();

    model.fetchCustomers = function () {
        return $http.get(`${url}/getCustomers`).then(function (response) {
            angular.copy(response.data, model.customers);
        }, function (error) {
            NotificationService.showError(error.status);
        });
    };

    model.addCustomer = function (data) {
        return $http.post(`${url}/addCustomer`, data).then(response => {
            model.customers.push(response.data);
            $('#customerModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        })
    };

    model.editCustomer = function (data) {
        return $http.post(`${url}/editCustomer`, data).then(response => {
            $('#customerModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    model.deleteCustomer = data => {
        return $http.post(`${url}/deleteCustomer`, data).then(res => {
            const index = model.customers.findIndex((x => x.customer_ID == res.data.customer_ID));
            model.customers.splice(index, 1);
            $('#customerModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    return model;
}]);