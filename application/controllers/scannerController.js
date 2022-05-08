app.controller('scannerController', function ($scope, scannerFactory, doctorsFactory, DateService, NotificationService) {

    // get logged in user type
    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    $scope.doctors = doctorsFactory.doctors;
    $scope.settings = scannerFactory.settings;
    $scope.invoices = scannerFactory.invoices

    // Tabs selection
    $scope.tabSelected = scannerFactory.tabSelected;
    $scope.selectTab = tab => {
        if (tab != scannerFactory.tabSelected) {
            scannerFactory.selectTab(tab);
            $scope.tabSelected = scannerFactory.tabSelected;
            $scope.items = null;
            $scope.activeRow = null;
        }
    };

    // open film modal
    $scope.openFilmModal = () => {
        $scope.isDoctor = false;
        $scope.newFilmData = {
            doctor_ID_FK: null,
            // qty: 1,
            customer_name: null,
            record_date: DateService.getDate(),
            record_time: DateService.getTime(),
            doctor_fee: null,
            record_value: $scope.settings[2].value,
        }
        $('#filmModal').modal('toggle');
    }
    // submit invoice
    $scope.submit = () => {
        if ($scope.isDoctor) {
            $scope.newFilmData.doctor_fee = $scope.settings[1].value;
            $scope.newFilmData.record_value = $scope.settings[2].value - $scope.settings[1].value;
        }
        scannerFactory.submit($scope.newFilmData);
    }

    // define datepicker value
    $scope.datePickerValue = scannerFactory.datePickerValue;
    function datepicker() {
        $('#historyDatePicker').datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function () {
                var d = $('#historyDatePicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                scannerFactory.datePickerValue = d;
                $scope.$digest($scope.datePickerValue = d);
            }
        }).datepicker("setDate", scannerFactory.datePickerValue);
    };
    datepicker();
    // set today's date function
    $scope.today = () => {
        scannerFactory.datePickerValue = DateService.getDate();
        $scope.datePickerValue = scannerFactory.datePickerValue;
        datepicker();
    };
    // watch for datepicker value change and get invoices
    $scope.$watch('datePickerValue', function () {
        $scope.activeRow = null;
        scannerFactory.fetchInvoices();
        // scannerFactory.fetchSalesInvoices($scope.datePickerValue);
    });


// #################################################################################################
// #################################################################################################    
// #################################################################################################
// #################################################################################################

    // add films
    $scope.addFilmsPackage = () => {
        if($scope.settings[0].value == 0) {
            scannerFactory.addFilmsPackage();
        } else {
            NotificationService.showErrorToast('You cannot add films until it is empty!')
        }
    }

    // edit settings
    $scope.editSettings = type => {
        if (type == 'doctor') {
            $scope.editModalData = {
                ID: 2,
                value: $scope.settings[1].value
            }
        } else {
            $scope.editModalData = {
                ID: 3,
                value: $scope.settings[2].value
            }
        }
        $('#editSettingsModal').modal('toggle');
    }

    // submit edit
    $scope.submitEditSettings = () => {
        scannerFactory.submitEditSettings($scope.editModalData)
    }

    // print record
    $scope.printRecord = ID => {
        scannerFactory.printRecord(ID);
    }

    // delete record
    $scope.deleteRecord = data => {
        scannerFactory.deleteRecord(data);
    }

});