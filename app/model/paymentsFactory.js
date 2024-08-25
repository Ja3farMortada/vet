app.factory('paymentsFactory', ['$http', 'NotificationService', 'DateService', function ($http, NotificationService, DateService) {

    // define url
    const url = `http://localhost:3000`;

    var model = {};
    model.selectedTab = 'global';
    model.assets = {};
    model.todaysTotalPayments = [];
    model.datePicker1 = DateService.getDate();
    model.datePicker2 = DateService.getDate();
    model.payments = [];
    model.totalSum = {
        totalWhish: 0,
        totalTalaco: 0,
        totalMhabib: 0,
        totalRent: 0,
        totalBills: 0,
        totalMwazafin: 0,
        totalOther: 0
    }

    // tab selection
    model.selectTab = function (tab) {
        if (this.selectedTab != tab) {
            switch (tab) {
                case 'global':
                    this.selectedTab = 'global';
                    break;

                case 'details':
                    this.selectedTab = 'details';
                    break;
            }
        }
    }

    const getAssets = () => {
        return $http.get(`${url}/getAssets`).then(function (response) {
            angular.copy(response.data[0], model.assets);
        }, function (error) {
            NotificationService.showError(error.status);
        });
    };
    model.getAssets = getAssets();

    const getTodaysTotalPayments = () => {
        return $http.get(`${url}/getTodaysTotalPayments`, {
            params: {
                date: DateService.getDate()
            }
        }).then(function (response) {
            angular.copy(response.data, model.todaysTotalPayments);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getTodaysTotalPayments = getTodaysTotalPayments();

    model.fetchTodaysPayments = () => {
        return $http.get(`${url}/getTodaysTotalPayments`, {
            params: {
                "date": DateService.getDate()
            }
        }).then(function (response) {
            angular.copy(response.data, model.todaysTotalPayments);
        }, function (error) {
            NotificationService.showError(error.status);
        });
    }

    // add money
    model.addMoney = amount => {
        return $http.post(`${url}/addMoney`, amount).then(function (response) {
            angular.copy(response.data[0], model.assets);
            NotificationService.showSuccessToast();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // add new payment
    model.addPayment = data => {
        return $http.post(`${url}/addPayment`, data).then(function (response) {
            // will return assets
            model.fetchTodaysPayments();
            angular.copy(response.data[0], model.assets);
            NotificationService.showSuccessToast();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    // get payments
    model.getPayments = () => {
        return $http.get(`${url}/getPayments`, {
            params: {
                date1: model.datePicker1,
                date2: model.datePicker2
            }
        }).then(function (response) {
            angular.copy(response.data, model.payments);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.createChart = function () {
        if (typeof paymentChart !== 'undefined') {
            paymentChart.destroy();
        };
        var ctx = $('#paymentsChart');
        paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    'Whish',
                    'Talaco',
                    'Habib',
                    'Rent',
                    'Bills',
                    'Mwazafin',
                    'other'
                ],
                datasets: [{
                    backgroundColor: [
                        '#ffc107', // bootstrap warning
                        '#17a2b8', // bootstrap info
                        '#dc3545', // danger
                        '#28a745', // bootstrab success
                        '#FF1493', // pink
                        '#007bff', // primary
                        '#6c757d', // secondary
                        // #17a2b8 // info
                    ],
                    data: [
                        model.totalSum.totalWhish,
                        model.totalSum.totalTalaco,
                        model.totalSum.totalMhabib,
                        model.totalSum.totalRent,
                        model.totalSum.totalBills,
                        model.totalSum.totalMwazafin,
                        model.totalSum.totalOther
                    ]
                }]
            }
        });
    }

    return model;

}]);