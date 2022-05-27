app.controller('reportsController', function ($scope, ReportsFactory) {

    // bind variables with Factory
    $scope.dates = ReportsFactory.dates;

    $scope.topSales = ReportsFactory.topSales;
    $scope.topServices = ReportsFactory.topServices;

    $scope.salesReport = ReportsFactory.salesReport;
    $scope.totalPayments = ReportsFactory.totalPayments;
    $scope.animalsData = ReportsFactory.animalsData;

    ReportsFactory.salesReportChart();
    ReportsFactory.createAnimalsChart();

    // start datepicker
    $('#startDatepicker').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: $scope.dates.end_date,
        onSelect: function (selected) {
            var d = $('#startDatepicker').datepicker({
                dateFormat: 'yy-mm-dd'
            }).val();
            $scope.$digest($scope.dates.start_date = d);
            $('#endDatepicker').datepicker("option", "minDate", selected)
        }
    }).datepicker();

    // end datepicker
    $('#endDatepicker').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: $scope.dates.start_date,
        onSelect: function (selected) {
            var d = $('#endDatepicker').datepicker({
                dateFormat: 'yy-mm-dd'
            }).val();
            $scope.$digest($scope.dates.end_date = d);
            $('#startDatepicker').datepicker("option", "maxDate", selected)
        }
    }).datepicker();

    $scope.getReports = () => {
        ReportsFactory.topSalesReport();
        ReportsFactory.topServicesReport();
        ReportsFactory.getSalesReport();
        ReportsFactory.getAnimalsReport();
    }

});