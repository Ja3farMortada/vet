app.factory('stockModel', ['$http', 'NotificationService', function($http, NotificationService) {
    // define URL
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.exchangeRate = {exchange_rate: 0};
   

    const getExchangeRate = function () {
        return $http.get(`${url}/getExchangeRate`).then(function(response) {
            angular.copy(response.data, model.exchangeRate);
        }, function (error) {
            NotificationService.showError(error.status);
        });
    };
    model.getExchangeRate = getExchangeRate();

    model.updateExchangeRate = function (data) {
        return $http.post(`${url}/updateExchangeRate`, {rate: data}).then(function () {
            NotificationService.showSuccess();
        }, function (error) {
            NotificationService.showError(error.status);
        });
    };

    return model;
}]);