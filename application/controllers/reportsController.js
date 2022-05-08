app.controller('reportsController', function ($scope, ReportsFactory, suppliersFactory) {

    // bind variables with Factory
    $scope.dates = ReportsFactory.dates;
    $scope.topSales = ReportsFactory.topSales;
    $scope.topSupplies = ReportsFactory.topSupplies;
    $scope.salesReport = ReportsFactory.salesReport;
    $scope.totalPayments = ReportsFactory.totalPayments;
    $scope.panoramicData = ReportsFactory.panoramicData;
    $scope.selectedSupplier = ReportsFactory.selectedSupplier;

    // bind suppliers
    $scope.suppliers = suppliersFactory.suppliers;

    ReportsFactory.salesReportChart();
    ReportsFactory.createPanoramicChart();

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
        ReportsFactory.topSuppliesReport();
        ReportsFactory.getSalesReport($scope.selectedSupplier.value);
        ReportsFactory.getPanoramicReport();
    }

});