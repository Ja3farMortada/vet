app.factory('stockFactory', function ($http, NotificationService) {

    // define url
    const url = `http://localhost:3000`;

    var model = {};
    model.items = [];
    model.totalStock = {};
    model.isLira = false;

    model.itemsPerPage = {
        value: 10
    };

    model.options = [];

    // items per page
    model.setItemsPerPage = () => {
        return options = [{
                name: "10",
                value: 10
            },
            {
                name: "15",
                value: 15
            },
            {
                name: "30",
                value: 30
            },
            {
                name: "50",
                value: 50
            },
            {
                name: "All",
                value: model.items.length
            },
        ]
    }

    // toggle to dollar
    model.toggleCurrency = () => {
        model.isLira = !model.isLira;
    };

    // cached data function
    const getItems = function () {
        return $http.get(`${url}/getItems`).then(function (response) {
            angular.copy(response.data, model.items);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getItems = getItems(); // expose the function to the outer execution context

    // fetch real-time data function
    model.fetchItems = function () {
        return $http.get(`${url}/getItems`).then(function (response) {
            angular.copy(response.data, model.items);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // Get Total Stock Data
    const getTotalStock = function() {
        return $http.get(`${url}/getTotalStock`).then(function (response) {
            angular.copy(response.data[0], model.totalStock);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getTotalStock = getTotalStock();

    model.fetchTotalStock = function () {
        return $http.get(`${url}/getTotalStock`).then(function (response) {
            angular.copy(response.data[0], model.totalStock);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // Add Items
    model.addItem = function (item) {
        return $http.post(`${url}/addItem`, item).then(function (response) {
            model.fetchTotalStock();
            $('#itemModal').modal('toggle');
            NotificationService.showSuccess();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // Edit Items
    model.editItem = function (item) {
        return $http.post(`${url}/editItem`, item).then(function () {
            model.fetchTotalStock();
            $('#itemModal').modal('toggle');
            NotificationService.showSuccess();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // Delete Items
    model.deleteItem = function (ID) {
        return $http.post(`${url}/deleteItem`, ID).then(function () {
            model.fetchTotalStock();
            $('#itemModal').modal('toggle');
            NotificationService.showSuccess();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // get item history
    model.fetchItemHistory = item => {
        return $http.post(`${url}/fetchItemHistory`, item).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        });
    }

    return model;
});