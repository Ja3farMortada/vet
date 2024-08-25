app.factory('ReportsFactory', ['$http', 'NotificationService', function ($http, NotificationService) {

    // define url
    const url = `http://localhost:3000`;

    var model = {};
    model.topSales = [];
    model.topServices = [];
    model.salesReport = [];
    model.totalPayments = [{}];
    model.animalsData = [{}, {}];
    model.animalsDataDollar = [{}, {}];

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

    model.topServicesReport = () => {
        $http.post(`${url}/topServicesReport`, model.dates).then(function (response) {
            angular.copy(response.data, model.topServices);
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    model.getSalesReport = () => {
        let data = {
            start_date: model.dates.start_date,
            end_date: model.dates.end_date
        }
        $http.post(`${url}/getSalesReport`, data).then(function (response) {
            angular.copy(response.data, model.salesReport);
            // model.getTotalPayments(ID);
            model.salesReportChart();
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // getTotalPayments
    // model.getTotalPayments = async ID => {
    //     let data = {
    //         start_date: model.dates.start_date,
    //         end_date: model.dates.end_date,
    //         supplier_ID: ID
    //     }
    //     await $http.post(`${url}/getTotalPayments`, data).then(function (response) {
    //         angular.copy(response.data, model.totalPayments);
    //         model.salesReportChart();
    //     }, function (error) {
    //         NotificationService.showError(error);
    //     });
    // }

    // get Animals data
    model.getAnimalsReport = async () => {
        $http.post(`${url}/getAnimalsReport`, model.dates).then(response => {
            angular.copy(response.data, model.animalsData);
            if (model.animalsData.length == 1) {
                model.animalsData.push({total: 0})
            }
            $http.post(`${url}/getAnimalsReportDollar`, model.dates).then(response => {
                angular.copy(response.data, model.animalsDataDollar);
                if (model.animalsDataDollar.length == 1) {
                    model.animalsDataDollar.push({total: 0})
                }
                model.createAnimalsChart();
            }, error => {
                NotificationService.showError(error);
            });
        }, error => {
            NotificationService.showError(error);
        });
    }

    model.createAnimalsChart = () => {
        if (typeof animalsChart !== 'undefined') {
            animalsChart.destroy();
        }
        var ctx = document.getElementById('animalsChartElement').getContext('2d');
        animalsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Total Services L.L`, `Total Treatments L.L`],
                datasets: [{
                    backgroundColor: ['#007bff', '#dc3545'],
                    data: [model.animalsData[0].total || 0, model.animalsData[1].total || 0],
                    // stack: 'Stack 0'
                }]
            }
        });

        // dollar chart
        if (typeof animalsDollarChart !== 'undefined') {
            animalsDollarChart.destroy();
        }
        var ctx = document.getElementById('animalsDollarChartElement').getContext('2d');
        animalsDollarChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Total Services $`, `Total Treatments $`],
                datasets: [{
                    backgroundColor: ['#ffc107', '#17a2b8'],
                    data: [model.animalsDataDollar[0].total || 0, model.animalsDataDollar[1].total || 0],
                    // stack: 'Stack 0'
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
            var ctx = document.getElementById('salesReport').getContext('2d');
            salesReportChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [`Sales`, `Profit`],
                    datasets: [{
                        backgroundColor: ['#343a40', '#28a745'], // '#dc3545', '#007bff', '#ffc107', '#17a2b8'
                        data: [sales, profit],
                        stack: 'Stack 0'
                    }, ]
                },
                options: {
                    fill: true,
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