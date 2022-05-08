app.factory('scannerFactory', function ($http, NotificationService, DateService, doctorsFactory) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.tabSelected = 0;
    model.datePickerValue = DateService.getDate();
    model.settings = [];
    model.invoices = [];

    //tab selection
    model.selectTab = function (tab) {
        if (this.tabSelected != tab) {
            switch (tab) {
                case 0:
                    this.tabSelected = 0;
                    break;

                case 1:
                    this.tabSelected = 1;
                    break;
            };
        }
    };

    // Get invoices
    const getInvoices = () => {
        $http.get(`${url}/getFilmInvoices`, {
            params: {
                date: model.datePickerValue
            }
        }).then(response => {
            angular.copy(response.data, model.invoices);
        }, error => {
            NotificationService.showError(error);
        })
    }
    getInvoices();

    // fetch Invoices
    model.fetchInvoices = () => {
        getInvoices();
    }

    model.submit = data => {
        NotificationService.showConfirm().then(ok => {
            if (ok.isConfirmed) {
                $http.post(`${url}/addNewFilm`, data).then(() => {
                    model.fetchInvoices();
                    model.fetchSettings();
                    NotificationService.showSuccess();
                    $('#filmModal').modal('toggle');
                    // fetch doctors
                    doctorsFactory.fetchDoctors();
                    // fetch invoices if a doctor is selected
                    if (doctorsFactory.selectedID) {
                        doctorsFactory.getDebtsDetails({
                            ID: doctorsFactory.selectedID
                        });
                    }
                }, error => {
                    NotificationService.showError(error);
                });
            }
        })
    }

    const getSettings = () => {
        return $http.get(`${url}/getSettings`).then(response => {
            angular.copy(response.data, model.settings);
        }, error => {
            NotificationService.showError(error);
        })
    }
    getSettings();

    model.fetchSettings = () => {
        $http.get(`${url}/getSettings`).then(response => {
            angular.copy(response.data, model.settings);
        }, error => {
            NotificationService.showError(error);
        })
    }


    model.addFilmsPackage = () => {
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                $http.post(`${url}/addFilms`).then(function () {
                    model.settings[0].value = 150;
                    NotificationService.showSuccess();
                }, error => {
                    NotificationService.showError(error);
                })
            }
        })
    }

    model.submitEditSettings = data => {
        $http.post(`${url}/editSettings`, data).then(function () {
            model.fetchSettings();
            NotificationService.showSuccess();
            $('#editSettingsModal').modal('toggle');
        }, error => {
            NotificationService.showError(error);
        })
    }

    // print record
    model.printRecord = data => {
        NotificationService.showConfirm().then(ok => {
            if (ok.isConfirmed) {
                let total = data.record_value + (data.doctor_fee || 0);
                let invoice = [{
                    ID: data.record_ID,
                    name: 'Panoramic X-Ray',
                    price: total,
                    quantity: 1
                }];
                let printData = {
                    name: data.customer_name,
                    currency: 'lira',
                    total: total
                }
                ipcRenderer.send('printDocument', [invoice, printData]);
            }
        })
    }

    // delete record
    model.deleteRecord = data => {
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                $http.post(`${url}/deleteFilmInvoice`, {
                    ID: data.record_ID,
                    doctor_fee: data.doctor_fee,
                    doctor_ID_FK: data.doctor_ID_FK
                }).then(() => {
                    NotificationService.showSuccess();
                    model.fetchInvoices();
                    model.fetchSettings();
                    // fetch doctors
                    doctorsFactory.fetchDoctors();
                    // fetch invoices if a doctor is selected
                    if (doctorsFactory.selectedID) {
                        doctorsFactory.getDebtsDetails({
                            ID: doctorsFactory.selectedID
                        });
                    }
                }, error => {
                    NotificationService.showError(error);
                })
            }
        })
    }

    return model;
});