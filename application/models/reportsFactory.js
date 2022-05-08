app.factory('ReportsFactory', ['$http', 'NotificationService', function ($http, NotificationService) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.topSales = [];
    model.topSupplies = [];
    model.salesReport = [];
    model.totalPayments = [{}];
    model.panoramicData = {};
    model.selectedSupplier = {
        value: null
    }

    model.dates = {
        start_date: moment().clone().startOf('month').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD')
    }

    model.topSalesReport = () => {
        $http.post(`${url}/topSalesReport`, model.dates).then(function (response) {
            angular.copy(response.data, model.topSales);
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    model.topSuppliesReport = () => {
        $http.post(`${url}/topSuppliesReport`, model.dates).then(function (response) {
            angular.copy(response.data, model.topSupplies);
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    model.getSalesReport = ID => {
        let data = {
            start_date: model.dates.start_date,
            end_date: model.dates.end_date,
            supplier_ID: ID
        }
        $http.post(`${url}/getSalesReport`, data).then(function (response) {
            angular.copy(response.data, model.salesReport);
            model.getTotalPayments(ID);
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // getTotalPayments
    model.getTotalPayments = async ID => {
        let data = {
            start_date: model.dates.start_date,
            end_date: model.dates.end_date,
            supplier_ID: ID
        }
        await $http.post(`${url}/getTotalPayments`, data).then(function (response) {
            angular.copy(response.data, model.totalPayments);
            model.salesReportChart();
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // get panoramic data
    model.getPanoramicReport = async () => {
        $http.post(`${url}/getPanoramicReport`, model.dates).then(response => {
            angular.copy(response.data, model.panoramicData);
            model.createPanoramicChart();
        }, error => {
            NotificationService.showError(error);
        });
    }

    model.createPanoramicChart = () => {
        if (typeof panoramicChart !== 'undefined') {
            panoramicChart.destroy();
        }
        var ctx = document.getElementById('panoramicChartElement').getContext('2d');
        panoramicChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Total Sales`, `Doctors Fees`],
                datasets: [{
                    label: ['test'],
                    backgroundColor: ['#28a745', '#FF1493'],
                    data: [model.panoramicData.totalSales || 0, model.panoramicData.doctorsFees || 0]
                }]
            }
        });
    }

    model.salesReportChart = function () {
        if (typeof salesReportChart !== 'undefined') {
            salesReportChart.destroy();
        };
        if (model.salesReport.length != 0) {
            let sales = this.salesReport[0]['total_sales'];
            let profit = this.salesReport[0]['total_sales'] - this.salesReport[0]['total_cost'];
            let debts = this.salesReport[1]['total_sales'];
            let debtsPayments = model.totalPayments[0]['totalPayments'];
            let supplies = model.salesReport[2]['total_cost'];
            let suppliesPayments = model.totalPayments[1]['totalPayments'];
            var ctx = document.getElementById('salesReport').getContext('2d');
            salesReportChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [`Sales`, `Profit`, `Debts`, `D Payments`, `Supplies`, `S Payments`],
                    datasets: [{
                        backgroundColor: ['#343a40', '#28a745', '#dc3545', '#007bff', '#ffc107', '#17a2b8'], //dc3545
                        data: [sales, profit, debts, debtsPayments, supplies, suppliesPayments],
                        stack: 'Stack 0'
                    }, ]
                },
                options: {
                    // fill: true,
                    // indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    return model;

}]);