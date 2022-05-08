app.factory('doctorsFactory', function ($http, NotificationService) {
    
    // define URL
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.doctors = [];
    model.doctorDebts = [];
    model.selectedDebtsDetails = [];
    model.selectedPaymentDetails = [];
    model.totalDebts = [];
    model.activeRow = null;
    model.selectedID = null;
    model.sortData = {
        key: 'doctor_debit',
        reverse: true
    }

    model.sort = keyname => {
        model.sortData.key = keyname;
        model.sortData.reverse = !model.sortData.reverse;
    }

    model.getDebtsDetails = ID => {
        return $http.post(`${url}/getDoctorDebtsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedDebtsDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.getPaymentDetails = ID => {
        return $http.post(`${url}/getDoctorPaymentsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedPaymentDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    const getTotalDebts = function () {
        return $http.get(`${url}/getTotalDoctorDebts`).then(function (response) {
            angular.copy(response.data, model.totalDebts);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getTotalDebts = getTotalDebts();

    model.submitPayment = data => {
        return $http.post(`${url}/submitDoctorPayment`, data).then(function (response) {
            $('#submitPaymentModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.editPayment = data => {
        return $http.post(`${url}/editDoctorPayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.deletePayment = data => {
        return $http.post(`${url}/deleteDoctorPayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.updateDoctorDebit = data => {
        return $http.post(`${url}/updateDoctorDebit`, data).then(function (response) {
            angular.copy(response.data, model.doctors);
        }, function (error) {
            NotificationService.showError(error);
        });
    };


    // #######################################################################################################################
    // ############################################### CRUD SUPPLIERS ########################################################
    // #######################################################################################################################

    const getDoctors = function () {
        return $http.get(`${url}/getDoctors`).then(function (response) {
            angular.copy(response.data, model.doctors);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getDoctors = getDoctors();

    model.fetchDoctors = function () {
        return $http.get(`${url}/getDoctors`).then(function (response) {
            angular.copy(response.data, model.doctors);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.addDoctor = data => {
        return $http.post(`${url}/addDoctor`, data).then(response => {
            model.doctors.push(response.data);
            $('#doctorModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        })
    };

    model.editDoctor = data => {
        return $http.post(`${url}/editDoctor`, data).then(response => {
            $('#doctorModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    model.deleteDoctor = data => {
        return $http.post(`${url}/deleteDoctor`, data).then(res => {
            const index = model.doctors.findIndex((x => x.doctor_ID == res.data.doctor_ID));
            model.doctors.splice(index, 1);
            $('#doctorModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    return model;
});