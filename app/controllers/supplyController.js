app.controller('supplyController', ['$scope', 'supplyFactory', 'DateService', 'supplyFactory', 'suppliersFactory', 'stockFactory', 'NotificationService', function ($scope, supplyFactory, DateService, supplyFactory, suppliersFactory, stockFactory, NotificationService) {

    $scope.suppliers = suppliersFactory.suppliers;
    $scope.items = stockFactory.items;
    $scope.invoice = supplyFactory.invoice;
    $scope.invoiceDetails = supplyFactory.invoiceDetails;
    $scope.selectedSupplier = supplyFactory.selectedSupplier;
    $scope.isValidated = true;

    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    // define datepicker value
    function datepicker() {
        $('#supplyDatePicker').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#supplyDatePicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                supplyFactory.invoiceDetails.record_date = d;
                $scope.$digest($scope.invoiceDetails.record_date = d);
            }
        }).datepicker("setDate", supplyFactory.invoiceDetails.record_date);
    };
    datepicker();

    // set today's date function
    $scope.today = () => {
        supplyFactory.datePickerValue = DateService.getDate();
        $scope.datePickerValue = supplyFactory.datePickerValue;
        datepicker();
    };

    // add Item to invoice
    $scope.submitItem = () => {
        let index = $scope.items.findIndex(x => x.item_name == $scope.selectedItem);
        supplyFactory.addToInvoice(index);
        $scope.selectedItem = null;
    }

    // barcode scanner
    $scope.submitBarcode = () => {
        let index = $scope.items.findIndex(x => x.barcode == $scope.barcodeInput);
        supplyFactory.addToInvoice(index);
        $scope.barcodeInput = null;
    }

    // watch for invoice changes and calculate invoice's total cost and price
    $scope.$watch('invoice', function () {
        $scope.totalCost = supplyFactory.total().totalCost;
        $scope.totalPrice = supplyFactory.total().totalPrice;
        $scope.totalLiraPrice = supplyFactory.total().totalLiraPrice;
    }, true);

    // select quantity input on focus
    $scope.selectQuantity = function (index) {
        $('#qtyInput' + index).trigger('select');
    };

    // supplier name validation
    $scope.getSupplierID = () => {
        let index = $scope.suppliers.findIndex(x => x.supplier_name == $scope.selectedSupplier);
        let supplier_ID = null;
        if (index != -1) {
            supplier_ID = $scope.suppliers[index]['supplier_ID'];
        }
        return supplier_ID;
    }

    // delete a row from invoice view
    $scope.deleteRow = function (index) {
        supplyFactory.removeFromInvoice(index);
    };

    // **** EDIT COST ****
    // open edit cost modal
    $scope.openEditCostModal = function (index) {
        $scope.newCost = null;
        $('#editCostModal').modal('show');
        $('#editCostModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#editCostModal').on('hidden.bs.modal', function () {
            $('#barcodeInput').trigger('focus');
        });
        $scope.selectedIndex = index;
        $scope.selectedRowCost = $scope.invoice[index]['cost'].toLocaleString();
    };
    // edit price function
    $scope.editPrice = function () {
        $scope.invoice[$scope.selectedIndex]['cost'] = $scope.newCost;
        $('#editCostModal').modal('toggle');
    };


    // submit invoice
    $scope.submitInvoice = () => {
        let supplierID = $scope.getSupplierID();
        if (supplierID) {
            $scope.isValidated = true;
            $scope.invoiceDetails.supplier_ID_FK = supplierID;
            NotificationService.showConfirm().then(ok => {
                if (ok.isConfirmed) {
                    supplyFactory.submitInvoice($scope.invoice).then(function (res) {
                        if (res) {
                            supplyFactory.clearInvoice();
                            $scope.invoice = supplyFactory.invoice;
                            $scope.selectedSupplier = supplyFactory.selectedSupplier;
                            stockFactory.fetchItems();
                            suppliersFactory.updateSupplierDebit({
                                "supplier_ID": supplierID,
                                "debitAmount": $scope.totalCost,
                                "method": "add"
                            });
                        }
                    });
                }
            })
        } else {
            $scope.isValidated = false;
        }
    }

    //  cancel order
    $scope.cancelOrder = function () {
        NotificationService.showWarning().then((result) => {
            if (result.isConfirmed) {
                supplyFactory.clearInvoice();
                $scope.$digest($scope.invoice = supplyFactory.invoice);
                $scope.$digest($scope.selectedSupplier = supplyFactory.selectedSupplier);
            }
        });
    }

}]);