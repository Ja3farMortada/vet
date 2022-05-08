app.controller('sellController', ['$scope', '$http', '$timeout', 'sellFactory', 'stockFactory', 'DateService', 'DebtsFactory', 'NotificationService', 'stockModel', 'customersFactory', function ($scope, $http, $timeout, sellFactory, stockFactory, DateService, DebtsFactory, NotificationService, stockModel, customersFactory) {

    // define server path
    const url = `http://${keys.host}:${keys.port}`;

    // Get Items
    $scope.items = stockFactory.items;

    // Get Customers
    $scope.customers = customersFactory.customers;

    stockFactory.getItems.then(function () {
        angular.element(document.querySelector("#barcodeInput")).trigger('focus');
    });

    // get exchange rate
    $scope.exchangeRate = stockModel.exchangeRate;

    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    // bind invoice
    $scope.invoice = sellFactory.invoice;

    // toggle currency
    $scope.isLira = sellFactory.isLira;
    $scope.toggleCurrency = () => {
        sellFactory.toggleCurrency();
    };

    // watch for invoice changes and calculate invoice's total cost and price
    let total;
    $scope.$watch('invoice', function () {
        total = sellFactory.total();
        $scope.totalCost = total.totalCost;
        $scope.averageCost = total.averageCost;
        $scope.totalPrice = total.totalPrice;
        $scope.totalLiraPrice = total.totalLiraPrice;
    }, true);


    // open Print Modal
    $scope.openPrintModal = () => {
        $scope.printData = {
            name: null,
            currency: 'dollar',
            exchangeRate: $scope.exchangeRate.exchange_rate,
            total: 0
        }
        $('#printModal').modal('show');
    }
    // Print Order
    $scope.print = function () {
        if ($scope.invoice.length > 0) {
            if ($scope.printData.currency == 'lira') {
                $scope.printData.total = $scope.totalLiraPrice;
            } else {
                $scope.printData.total = $scope.totalPrice;
            }
            console.log($scope.printData)
            ipcRenderer.send('printDocument', [$scope.invoice, $scope.printData]);
            $('#printModal').modal('hide');
        }
    };

    // select quantity input on focus
    $scope.selectQuantity = function (index) {
        $('#input' + index).trigger('select');
    };

    // select item enter event
    $scope.selectOption = function (event) {
        if (event.keyCode == 13 && $scope.selectedItem) {
            event.preventDefault();
            let count = 0;
            for (let i = 0; i < $scope.items.length; i++) {
                if ($scope.selectedItem == $scope.items[i]['item_name']) {
                    count++;
                    let found = false;
                    for (let j = 0; j < $scope.invoice.length; j++) {
                        if ($scope.selectedItem == $scope.invoice[j]['name']) {
                            found = true;
                            $scope.invoice[j]['quantity'] += 1;
                            break;
                        }
                    }
                    if (!found) {
                        sellFactory.addToInvoice({
                            ID: $scope.items[i]['IID'],
                            barcode: $scope.items[i]['barcode'],
                            name: $scope.items[i]['item_name'],
                            currency: $scope.items[i]['item_currency'],
                            // original_price: $scope.items[i]['item_price'],
                            cost: $scope.items[i]['item_cost'],
                            average_cost: $scope.items[i]['average_cost'],
                            quantity: 1,
                            price: $scope.items[i]['item_price']
                        });
                    }
                    break;
                }
            }
            if (count == 0) {
                NotificationService.showErrorText('Item not found, it is not defined!')
            }
            $scope.selectedItem = null;
        }
    };

    // barcode input enter event
    $('#barcodeInput').keyup(function (e) {
        if (e.keyCode == 13) {
            let count = 0;
            if ($scope.barcode) {
                for (let i = 0; i < $scope.items.length; i++) {
                    if ($scope.items[i]['barcode'] == $scope.barcode) {
                        count++;
                        let found = 0;
                        for (let j = 0; j < $scope.invoice.length; j++) {
                            if ($scope.barcode == $scope.invoice[j]['barcode']) {
                                $scope.invoice[j]['quantity'] += 1;
                                found++;
                                break;
                            }
                        }
                        if (found == 0) {
                            sellFactory.addToInvoice({
                                ID: $scope.items[i]['IID'],
                                barcode: $scope.items[i]['barcode'],
                                name: $scope.items[i]['item_name'],
                                currency: $scope.items[i]['item_currency'],
                                original_price: $scope.items[i]['item_price'],
                                cost: $scope.items[i]['item_cost'],
                                average_cost: $scope.items[i]['average_cost'],
                                quantity: 1,
                                price: $scope.items[i]['item_price']
                            });
                        }
                        break;
                    }
                }
                if (count == 0) {
                    NotificationService.showErrorText('Item is not defined!');
                }
                $scope.$digest($scope.barcode = null);
            }
        }
    });

    // delete a row from invoice view
    $scope.deleteRow = function (index) {
        sellFactory.removeFromInvoice(index);
    };

    // **** EDIT PRICE ****
    // open edit price modal
    $scope.openEditPriceModal = function (index) {
        $scope.newPrice = null;
        $('#editPriceModal').modal('show');
        $('#editPriceModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#editPriceModal').on('hidden.bs.modal', function () {
            $('#barcodeInput').trigger('focus');
        });
        $scope.selectedIndex = index;
        $scope.minAtt = $scope.invoice[index]['cost'];
        $scope.selectedRowCost = $scope.invoice[index]['cost'].toLocaleString();
        $scope.selectedRowPrice = $scope.invoice[index]['price'].toLocaleString();
    };
    // edit price function
    $scope.editPrice = function () {
        $scope.invoice[$scope.selectedIndex]['price'] = $scope.newPrice;
        $('#editPriceModal').modal('toggle');
    };

    // checkout
    $scope.checkout = function () {
        $scope.selectedCustomer = null;
        $scope.cashReceived = null;
        $scope.validated = true;
        $('#selectCustomer').modal('show');
        $('#selectCustomer').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
    };

    $scope.validate = () => {
        $scope.validated = true;
    };
    // Confirm Order button clicked!
    $scope.confirmOrderClicked = function () {
        if (!$scope.selectedCustomer && $scope.cashReceived == null) {
            $scope.cashReceived = 0;
            $('#cashInput').trigger('select');
        } else if (!$scope.selectedCustomer) {
            Swal.fire({
                title: `Change: ${($scope.cashReceived - $scope.totalPrice).toLocaleString()} $`,
                icon: "info"
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmOrder(null);
                }
            });
        } else {
            $scope.validated = false;
            let customerID;
            for (let i = 0; i < $scope.customers.length; i++) {
                if ($scope.customers[i].customer_name == $scope.selectedCustomer) {
                    $scope.validated = true;
                    customerID = $scope.customers[i].customer_ID;
                    break;
                } else {
                    $('#choose').trigger('select');
                }
            }
            if ($scope.validated) {
                NotificationService.showWarning().then((result) => {
                    if (result.isConfirmed) {
                        confirmOrder(customerID);
                    } else {
                        $('#choose').trigger('focus');
                    }
                });
            }
        }
    };

    // ***** CONFIRM ORDER FUNCTION *****
    async function confirmOrder(ID) {
        $('#selectCustomer').modal('toggle');
        let date = DateService.getDate();
        let time = DateService.getTime();
        $('#barcodeInput').trigger('focus');
        let invoiceTotalCost = $scope.totalCost;
        let averageCost = $scope.averageCost;
        let invoiceTotalPrice = $scope.totalPrice;
        let dollar_exchange = $scope.exchangeRate.exchange_rate;
        $http.post(`${url}/addInvoice`, {
            "items": $scope.invoice,
            "invoice": {
                "UID_FK": $scope.loggedInUser.UID,
                "customer_ID_FK": ID,
                "invoice_date": date,
                "invoice_time": time,
                "invoice_total_cost": invoiceTotalCost,
                "total_average_cost": averageCost,
                "invoice_total_price": invoiceTotalPrice,
                "dollar_exchange": dollar_exchange
            }
        }).then(function () {
            NotificationService.showSuccessCash();
            sellFactory.clearInvoice();
            $scope.invoice = sellFactory.invoice;
            $('#barcodeInput').trigger('focus');
            if (ID) {
                DebtsFactory.updateCustomerDebit({
                    "customer_ID": ID,
                    "debitAmount": invoiceTotalPrice,
                    "method": "add"
                });
                DebtsFactory.getDebtsDetails(DebtsFactory.selectedID);
            }
            $timeout(function () {
                stockFactory.fetchItems();
            }, 1000);
            // stockFactory.fetchTotalStock();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    $scope.cancelOrder = function () {
        Swal.fire({
            title: "WARNING",
            text: "Are you sure you want to cancel order?",
            icon: "question",
            iconHtml: '?',
            showCancelButton: true,
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                sellFactory.clearInvoice();
                $scope.$digest($scope.invoice = sellFactory.invoice);
                angular.element(document.querySelector("#barcodeInput")).trigger('focus');
            }
        });
    }

}]);