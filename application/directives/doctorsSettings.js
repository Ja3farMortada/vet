app.directive('doctorsSettings', function (doctorsFactory, NotificationService) {
    return {
        restrict: 'E',
        templateUrl: '../templates/doctorsSettings.html',
        scope: {

        },
        link: function (scope) {

            scope.doctors = doctorsFactory.doctors;


            scope.openNewDoctorModal = () => {
                scope.selectedModal = 'add';
                scope.modalTitle = 'Add New doctor';
                scope.doctorDetails = {
                    doctor_name: null,
                    doctor_phone: null,
                    doctor_address: null,
                    doctor_debit: 0
                };

                $('#doctorModal').modal('show');
                $('#doctorModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
            };

            let index;
            scope.openEditDoctorModal = ID => {
                scope.selectedModal = 'edit';
                scope.modalTitle = 'Edit Doctor';
                index = scope.doctors.findIndex(index => index.doctor_ID == ID);
                scope.doctorDetails = {};
                angular.copy(scope.doctors[index], scope.doctorDetails);
                $('#doctorModal').modal('show');
                $('#doctorModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
            };

            function addDoctor() {
                doctorsFactory.addDoctor(scope.doctorDetails);
            };

            function editDoctor() {
                doctorsFactory.editDoctor(scope.doctorDetails).then(function (response) {
                    angular.copy(response[0], scope.doctors[index]);
                })
            };

            scope.submit = () => {
                switch (scope.selectedModal) {
                    case 'add':
                        addDoctor();
                        break;
                    case 'edit':
                        editDoctor();
                        break;
                }
            };

            scope.deleteDoctor = () => {
                NotificationService.showWarning().then(ok => {
                    if (ok.isConfirmed) {
                        doctorsFactory.deleteDoctor({
                            ID: scope.doctorDetails.doctor_ID
                        });
                    }
                });
            }
        }
    }
});