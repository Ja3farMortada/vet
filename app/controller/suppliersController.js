app.controller("suppliersController", [
  "$scope",
  "suppliersFactory",
  "DateService",
  "stockModel",
  "NotificationService",
  function (
    $scope,
    suppliersFactory,
    DateService,
    stockModel,
    NotificationService
  ) {
    $scope.supplierDebts = suppliersFactory.suppliers;
    $scope.selectedDetails = suppliersFactory.selectedDebtsDetails;
    $scope.selectedPaymentDetails = suppliersFactory.selectedPaymentDetails;
    $scope.selectedInvoiceDetails = [];
    $scope.activeRow = suppliersFactory.activeRow;
    $scope.exchangeRate = stockModel.exchangeRate;

    $scope.isActive = ID => {
      let index = $scope.supplierDebts.findIndex(
        index => index.supplier_ID == ID
      );
      return $scope.activeRow === index;
    };

    // sorting in table
    $scope.sortData = suppliersFactory.sortData;

    $scope.sort = keyname => {
      suppliersFactory.sort(keyname);
    };
    // $scope.sort = function (keyname) {
    //     $scope.sortKey = keyname;
    //     $scope.reverse = !$scope.reverse;
    // };

    // get selected supplier details
    $scope.getDetails = function (ID) {
      let index = $scope.supplierDebts.findIndex(
        index => index.supplier_ID == ID
      );
      suppliersFactory.activeRow = index;
      $scope.activeRow = suppliersFactory.activeRow;
      suppliersFactory.getDebtsDetails({
        ID: ID,
      });
      suppliersFactory.getPaymentDetails({
        ID: ID,
      });
    };

    // tab selection
    $scope.tabSelected = 1;
    $scope.selectTab = function (tab) {
      suppliersFactory.getDebtsDetails({
        ID: $scope.supplierDebts[$scope.activeRow]["supplier_ID"],
      });
      if ($scope.tabSelected !== tab) {
        $scope.tabSelected = tab;
      }
    };

    // open payment modal
    $scope.submitPaymentModal = () => {
      $scope.paymentData = {
        supplier_ID_FK: $scope.supplierDebts[$scope.activeRow].supplier_ID,
        payment_amount: null,
        payment_date: DateService.getDate(),
        payment_time: DateService.getTime(),
        dollar_exchange: $scope.exchangeRate.exchange_rate,
        payment_notes: "",
      };
      $("#submitPaymentModal").on("shown.bs.modal", function () {
        $(this).find("[autofocus]").trigger("focus");
      });
      $("#submitPaymentModal").modal("show");
    };
    $scope.submitPayment = () => {
      suppliersFactory
        .submitPayment($scope.paymentData)
        .then(function (response) {
          if (response) {
            $scope.selectedPaymentDetails.unshift(response);
            suppliersFactory.fetchSuppliers();
          }
        });
    };

    // declate edit payment modal
    $scope.editPaymentModal = data => {
      $scope.paymentData = {
        supplier_ID_FK: $scope.supplierDebts[$scope.activeRow].supplier_ID,
        payment_ID: data.payment_ID,
        payment_amount: data.payment_amount,
        old_payment_amount: data.payment_amount,
        payment_notes: data.payment_notes,
      };
      $("#editPaymentModal").on("shown.bs.modal", function () {
        $(this).find("[autofocus]").trigger("focus");
      });
      $("#editPaymentModal").modal("show");
    };
    // submit edit payment
    $scope.editPayment = () => {
      suppliersFactory
        .editPayment($scope.paymentData)
        .then(function (response) {
          if (response) {
            let index = $scope.selectedPaymentDetails.findIndex(
              x => x.payment_ID == $scope.paymentData.payment_ID
            );
            angular.copy(response, $scope.selectedPaymentDetails[index]);
            suppliersFactory.fetchSuppliers();
          }
        });
    };
    // delete payment
    $scope.deletePayment = () => {
      NotificationService.showWarning().then(ok => {
        if (ok.isConfirmed) {
          suppliersFactory.deletePayment($scope.paymentData).then(function () {
            let index = $scope.selectedPaymentDetails.findIndex(
              x => x.payment_ID == $scope.paymentData.payment_ID
            );
            $scope.selectedPaymentDetails.splice(index, 1);
            suppliersFactory.fetchSuppliers();
          });
        }
      });
    };

    $scope.getInvoiceDetails = (data, type) => {
      $scope.selectedInvoiceDetails = data;
      $("#invoiceDetailsModal").modal("show");
    };
  },
]);
