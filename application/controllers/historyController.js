app.controller('historyController', ['$scope', 'historyFactory', 'DateService', 'NotificationService', 'stockModel', function ($scope, historyFactory, DateService, NotificationService, stockModel) {

    // get logged in user type
    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    // get exchange rate
    $scope.exchangeRate = stockModel.exchangeRate;

    // bind invoices with model factory
    $scope.salesInvoices = historyFactory.salesInvoices;
    $scope.servicesInvoices = historyFactory.servicesInvoices;

    // Tabs selection
    $scope.tabSelected = historyFactory.tabSelected;
    $scope.selectTab = tab => {
        if (tab != historyFactory.tabSelected) {
            historyFactory.selectTab(tab);
            $scope.tabSelected = historyFactory.tabSelected;
            $scope.items = null;
            $scope.activeRow = null;
            $scope.user = null;
        }
    };

    // define datepicker value
    $scope.datePickerValue = historyFactory.datePickerValue;

    function datepicker() {
        $('#invoiceDatePicker').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#invoiceDatePicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                historyFactory.datePickerValue = d;
                $scope.$digest($scope.datePickerValue = d);
            }
        }).datepicker("setDate", historyFactory.datePickerValue);
    };
    datepicker();

    // set today's date function
    $scope.today = () => {
        historyFactory.datePickerValue = DateService.getDate();
        $scope.datePickerValue = historyFactory.datePickerValue;
        datepicker();
    };


    // watch for datepicker value change and get invoices
    $scope.$watch('datePickerValue', function () {
        $scope.items = null;
        $scope.activeRow = null;
        historyFactory.fetchSalesInvoices($scope.datePickerValue);
        historyFactory.fetchServicesInvoices($scope.datePickerValue);
    });

    // show invoice details 
    let selectedInvoice;
    $scope.showInvoiceDetails = (ID, totalPrice) => {
        $scope.totalPrice = totalPrice;
        switch ($scope.tabSelected) {
            case 0:
                let index = $scope.salesInvoices.findIndex(index => index.invoice_ID == ID);
                selectedInvoice = $scope.salesInvoices[index];
                $scope.user = $scope.salesInvoices[index]['user']
                $scope.items = $scope.salesInvoices[index]['invoice_details'];
                $scope.activeRow = ID;
                break;

                // case 1:
                //     let index2 = $scope.servicesInvoices.findIndex(index2 => index2.record_ID == ID);
                //     selectedInvoice = $scope.servicesInvoices[index2];
                //     $scope.items = $scope.servicesInvoices[index2]['invoice_details'];
                //     $scope.activeRow = ID;
                //     break;
        }
    };

    // delete invoice
    $scope.deleteInvoice = function () {
        // console.log(selectedInvoice);
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                historyFactory.deleteInvoice(selectedInvoice, $scope.tabSelected, $scope.datePickerValue).then(function () {
                    $scope.activeRow = null;
                    $scope.items = null
                });
            }
        });
    };


    $scope.isActive = ID => {
        return $scope.activeRow === ID;
    };

    // open Print Modal
    $scope.openPrintModal = () => {
        $scope.printData = {
            name: selectedInvoice.supplier_name ? selectedInvoice.supplier_name : selectedInvoice.customer_name,
            currency: 'dollar',
            exchangeRate: $scope.exchangeRate.exchange_rate,
            total: 0
        }
        $('#printModal').modal('show');
    }
    // print function
    $scope.print = function () {
        let invoice = [];
        // if ($scope.tabSelected === 0) {
        for (let i = 0; i < $scope.items.length; i++) {
            invoice[i] = {
                ID: selectedInvoice.invoice_ID || selectedInvoice.record_ID,
                name: $scope.items[i]['item_name'],
                price: $scope.items[i]['price'] || $scope.items[i]['cost'],
                quantity: $scope.items[i]['qty']
            }
        }
        if ($scope.printData.currency == 'dollar') {
            $scope.printData.total = $scope.totalPrice;
        } else {
            $scope.printData.total = $scope.totalPrice * stockModel.exchangeRate.exchange_rate;
        }
        // }
        ipcRenderer.send('printDocument', [invoice, $scope.printData]);
    };

}]);