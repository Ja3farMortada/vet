app.directive('suppliersSettings', function (suppliersFactory, NotificationService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/suppliersSettings.html',
        scope: {

        },
        link: function (scope) {

            scope.suppliers = suppliersFactory.suppliers;


            scope.openNewSupplierModal = () => {
                scope.selectedModal = 'add';
                scope.modalTitle = 'Add New supplier';
                scope.supplierDetails = {
                    supplier_name: null,
                    supplier_phone: null,
                    supplier_address: null,
                    supplier_debit: 0
                };

                $('#supplierModal').modal('show');
                $('#supplierModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
            };

            let index;
            scope.openEditSupplierModal = ID => {
                scope.selectedModal = 'edit';
                scope.modalTitle = 'Edit Supplier';
                index = scope.suppliers.findIndex(index => index.supplier_ID == ID);
                scope.supplierDetails = {};
                angular.copy(scope.suppliers[index], scope.supplierDetails);
                $('#supplierModal').modal('show');
                $('#supplierModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
            };

            function addSupplier() {
                suppliersFactory.addSupplier(scope.supplierDetails);
            };

            function editSupplier() {
                suppliersFactory.editSupplier(scope.supplierDetails).then(function (response) {
                    angular.copy(response[0], scope.suppliers[index]);
                })
            };

            scope.submit = () => {
                switch (scope.selectedModal) {
                    case 'add':
                        addSupplier();
                        break;
                    case 'edit':
                        editSupplier();
                        break;
                }
            };

            scope.deleteSupplier = () => {
                NotificationService.showWarning().then(ok => {
                    if (ok.isConfirmed) {
                        suppliersFactory.deleteSupplier({
                            ID: scope.supplierDetails.supplier_ID
                        });
                    }
                });
            }
        }
    }
});