app.controller('doctorsController', function($scope, doctorsFactory, DateService, stockModel, NotificationService) {

    $scope.doctorDebts = doctorsFactory.doctors;
    $scope.selectedDetails = doctorsFactory.selectedDebtsDetails;
    $scope.selectedPaymentDetails = doctorsFactory.selectedPaymentDetails;
    $scope.selectedInvoiceDetails = [];
    $scope.activeRow = doctorsFactory.activeRow;
    $scope.exchangeRate = stockModel.exchangeRate;


    $scope.isActive = ID => {
        let index = $scope.doctorDebts.findIndex(i => i.doctor_ID == ID);
        return $scope.activeRow === index;
    };

    // sorting in table
    $scope.sortData = doctorsFactory.sortData;

    $scope.sort = keyname => {
        doctorsFactory.sort(keyname);
    }
    // $scope.sort = function (keyname) {
    //     $scope.sortKey = keyname;
    //     $scope.reverse = !$scope.reverse;
    // };

    // get selected doctor details
    $scope.getDetails = ID => {
        doctorsFactory.selectedID = ID;
        let index = $scope.doctorDebts.findIndex(index => index.doctor_ID == ID);
        doctorsFactory.activeRow = index;
        $scope.activeRow = doctorsFactory.activeRow;
        doctorsFactory.getDebtsDetails({
            ID: ID
        });
        doctorsFactory.getPaymentDetails({
            ID: ID
        });
    };

    // tab selection
    $scope.tabSelected = 1;
    $scope.selectTab = function (tab) {
        doctorsFactory.getDebtsDetails({
            ID: $scope.doctorDebts[$scope.activeRow]['doctor_ID']
        });
        if ($scope.tabSelected !== tab) {
            $scope.tabSelected = tab;
        }
    };

    // open payment modal
    $scope.submitPaymentModal = () => {
        $scope.paymentData = {
            "doctor_ID_FK": $scope.doctorDebts[$scope.activeRow].doctor_ID,
            "payment_amount": null,
            "payment_date": DateService.getDate(),
            "payment_time": DateService.getTime(),
            "dollar_exchange": $scope.exchangeRate.exchange_rate,
            "payment_notes": ''
        };
        $('#submitPaymentModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#submitPaymentModal').modal('show');
    };
    $scope.submitPayment = () => {
        doctorsFactory.submitPayment($scope.paymentData).then(function (response) {
            if (response) {
                $scope.selectedPaymentDetails.unshift(response);
                doctorsFactory.fetchDoctors();
            }
        });
    };

    // declate edit payment modal
    $scope.editPaymentModal = data => {
        $scope.paymentData = {
            "doctor_ID_FK": $scope.doctorDebts[$scope.activeRow].doctor_ID,
            "payment_ID": data.payment_ID,
            "payment_amount": data.payment_amount,
            "old_payment_amount": data.payment_amount,
            "payment_notes": data.payment_notes
        };
        $('#editPaymentModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#editPaymentModal').modal('show');
    };
    // submit edit payment
    $scope.editPayment = () => {
        doctorsFactory.editPayment($scope.paymentData).then(function (response) {
            if (response) {
                let index = $scope.selectedPaymentDetails.findIndex(x => x.payment_ID == $scope.paymentData.payment_ID);
                angular.copy(response, $scope.selectedPaymentDetails[index]);
                doctorsFactory.fetchDoctors();
            }
        });
    };
    // delete payment
    $scope.deletePayment = () => {
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                doctorsFactory.deletePayment($scope.paymentData).then(function () {
                    let index = $scope.selectedPaymentDetails.findIndex(x => x.payment_ID == $scope.paymentData.payment_ID);
                    $scope.selectedPaymentDetails.splice(index, 1);
                    doctorsFactory.fetchDoctors();
                });
            }
        });
    };


    $scope.getInvoiceDetails = (data, type) => {
        $scope.selectedInvoiceDetails = data;
        $('#invoiceDetailsModal').modal('show');
    };

});