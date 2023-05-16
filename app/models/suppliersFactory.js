app.factory('suppliersFactory', ['$http', 'NotificationService', function ($http, NotificationService) {

    // define URL
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.suppliers = [];
    model.supplierDebts = [];
    model.selectedDebtsDetails = [];
    model.selectedPaymentDetails = [];
    model.totalDebts = [];
    model.activeRow = null;
    model.sortData = {
        key: 'supplier_debit',
        reverse: true
    }

    model.sort = keyname => {
        model.sortData.key = keyname;
        model.sortData.reverse = !model.sortData.reverse;
    }

    model.getDebtsDetails = ID => {
        return $http.post(`${url}/getSupplierDebtsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedDebtsDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.getPaymentDetails = ID => {
        return $http.post(`${url}/getSupplierPaymentsDetails`, ID).then(function (response) {
            angular.copy(response.data, model.selectedPaymentDetails);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    const getTotalDebts = function () {
        return $http.get(`${url}/getTotalSupplierDebts`).then(function (response) {
            angular.copy(response.data, model.totalDebts);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getTotalDebts = getTotalDebts();

    model.submitPayment = data => {
        return $http.post(`${url}/submitSupplierPayment`, data).then(function (response) {
            $('#submitPaymentModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.editPayment = data => {
        return $http.post(`${url}/editSupplierPayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.deletePayment = data => {
        return $http.post(`${url}/deleteSupplierPayment`, data).then(function (response) {
            $('#editPaymentModal').modal('hide');
            NotificationService.showSuccessToast();
            return response.data;
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.updateSupplierDebit = data => {
        return $http.post(`${url}/updateSupplierDebit`, data).then(function (response) {
            angular.copy(response.data, model.suppliers);
        }, function (error) {
            NotificationService.showError(error);
        });
    };


    // #######################################################################################################################
    // ############################################### CRUD SUPPLIERS ########################################################
    // #######################################################################################################################

    const getSuppliers = function () {
        return $http.get(`${url}/getSuppliers`).then(function (response) {
            angular.copy(response.data, model.suppliers);
        }, function (error) {
            NotificationService.showError(error);
        });
    };
    model.getSuppliers = getSuppliers();

    model.fetchSuppliers = function () {
        return $http.get(`${url}/getSuppliers`).then(function (response) {
            angular.copy(response.data, model.suppliers);
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.addSupplier = data => {
        return $http.post(`${url}/addSupplier`, data).then(response => {
            model.suppliers.push(response.data);
            $('#supplierModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        })
    };

    model.editSupplier = data => {
        return $http.post(`${url}/editSupplier`, data).then(response => {
            $('#supplierModal').modal('hide');
            NotificationService.showSuccess();
            return response.data;
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    model.deleteSupplier = data => {
        return $http.post(`${url}/deleteSupplier`, data).then(res => {
            const index = model.suppliers.findIndex((x => x.supplier_ID == res.data.supplier_ID));
            model.suppliers.splice(index, 1);
            $('#supplierModal').modal('hide');
            NotificationService.showSuccess();
        }, function (err) {
            NotificationService.showError(err);
        });
    };

    return model;
}]);