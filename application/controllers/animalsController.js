app.controller('animalsController', function ($scope, animalsFactory, DateService, NotificationService, stockModel) {

    // get logged in user type
    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    $scope.moment = moment;
    $scope.exchangeRate = stockModel.exchangeRate;

    // get animals
    $scope.animals = animalsFactory.animals;
    let modalMode;

    // tab selection
    $scope.tabSelected = animalsFactory.tabSelected;
    $scope.selectTab = tab => {
        animalsFactory.selectTab(tab);
        $scope.tabSelected = animalsFactory.tabSelected;
    };


    // $scope.animalReminders = [];

    // define datepicker value
    // $scope.datePickerValue = historyFactory.datePickerValue;
    function datepicker() {
        $('#birthdatePicker').datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: DateService.getDate(),
            changeYear: true,
            changeMonth: true,
            onSelect: function () {
                var d = $('#birthdatePicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                $scope.$digest($scope.animalData.birthdate = d);
            }
        }).datepicker("setDate", null);

        $('#treatmentDatepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            minDate: DateService.getDate(),
            onSelect: function () {
                var d = $('#treatmentDatepicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                $scope.$digest($scope.treatmentData.reminder_date = d);
            }
        }).datepicker("setDate", null);

        $('#reminderDatepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            minDate: DateService.getDate(),
            onSelect: function () {
                var d = $('#reminderDatepicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                $scope.$digest($scope.reminderData.reminder_date = d);
            }
        }).datepicker("setDate", null);
    };
    datepicker();


    // open animal modal
    $scope.openAnimalModal = (type) => {
        switch (type) {
            case 'add':
                addAnimalModal();
                break;

            case 'edit':
                editAnimalModal();
                break;
        }
    }

    // Add Animal function
    function addAnimalModal() {
        modalMode = 'add';
        $scope.modalTitle = 'New Profile';
        $scope.animalData = {
            animal_name: null,
            species: null,
            breed: null,
            birthdate: null,
            gender: null,
            notes: null,
            owner_name: null,
            owner_phone: null,
            address: null
        };
        $('#animalModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#animalModal').modal('toggle');
    }

    // Edit Animal function

    let animalIndex;

    function editAnimalModal() {
        modalMode = 'edit';
        $scope.modalTitle = 'Edit Profile';
        $scope.animalData = {};
        animalIndex = $scope.animals.findIndex(x => x.animal_ID == $scope.selectedAnimal.animal_ID);
        angular.copy($scope.animals[animalIndex], $scope.animalData);
        $('#animalModal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').trigger('focus');
        });
        $('#animalModal').modal('toggle');
    }

    function submitAddAnimal() {
        animalsFactory.addAnimal($scope.animalData).then(response => {
            if (response) {
                $scope.animals.unshift(response);
            }
        })
    }

    function submitEditItem() {
        animalsFactory.editAnimal($scope.animalData).then(() => {
            $scope.animals[animalIndex] = $scope.animalData;
            $scope.showAnimalDetails($scope.animalData)
        })
    }

    $scope.submit = () => {
        switch (modalMode) {
            case 'add':
                submitAddAnimal();
                break;

            case 'edit':
                submitEditItem();
                break;
        }
    }

    // **** DELETE Animal ****
    $scope.deleteAnimal = () => {
        let animal = {
            ID: $scope.selectedAnimal.animal_ID
        };
        let index = $scope.animals.findIndex(x => x.animal_ID == animal.ID);
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                animalsFactory.deleteAnimal(animal).then(function () {
                    $scope.animals.splice(index, 1);
                    $scope.selectedAnimal = null;
                    $scope.activeRow = null;
                });
            }
        });
    };


    // Show animal details
    $scope.showAnimalDetails = data => {
        $scope.activeRow = data.animal_ID;
        $scope.selectedAnimal = data; // bind data with $scope variable
        let date = data.birthdate; // calculate age
        let diff = moment().diff(moment(date), 'milliseconds');
        let duration = moment.duration(diff);
        $scope.selectedAge = duration.humanize();
        animalsFactory.fetchTreatmentHistory(data).then(response => {
            if (response) {
                $scope.treatmentHistory = response;
            }
        });
        animalsFactory.fetchServiceHistory(data).then(response => {
            if (response) {
                $scope.serviceHistory = response;
            }
        })
        animalsFactory.fetchAnimalReminders(data).then(response => {
            if (response) {
                $scope.animalReminders = response;
            }
        })
    }

    $scope.isActive = ID => {
        return $scope.activeRow === ID;
    };


    // ########################## Treatment modal ##########################

    $scope.addTreatmentModal = () => {
        $scope.treatmentModalMode = 'add';
        $scope.treatmentData = {
            animal_ID_FK: $scope.selectedAnimal.animal_ID,
            treatment_type: null,
            treatment_description: null,
            treatment_notes: null,
            payment_currency: 'lira',
            payment_received: null,
            has_reminder: false,
            reminder_date: null,
            reminder_notes: null,
            exchange_rate: $scope.exchangeRate.exchange_rate,
            animal_name: $scope.selectedAnimal.animal_name,
            owner_name: $scope.selectedAnimal.owner_name,
            owner_phone: $scope.selectedAnimal.owner_phone
        }
        $('#treatmentModal').modal('toggle');
    }

    $scope.editTreatmentModal = data => {
        $scope.treatmentModalMode = 'edit';
        $scope.treatmentData = {};
        angular.copy(data, $scope.treatmentData);
        $('#treatmentModal').modal('toggle');
    }

    $scope.submitTreatment = () => {
        switch ($scope.treatmentModalMode) {
            case 'add': {
                $scope.treatmentData.treatment_date = DateService.getDate();
                $scope.treatmentData.treatment_time = DateService.getTime();
                animalsFactory.submitAddTreatment($scope.treatmentData);
                $scope.showAnimalDetails($scope.selectedAnimal);
                break;
            }
            case 'edit': {
                animalsFactory.submitEditTreatment($scope.treatmentData);
                $scope.showAnimalDetails($scope.selectedAnimal);
                break;
            }

        }

    }


    // delete treatment
    $scope.deleteTreatment = ID => {
        let index = $scope.treatmentHistory.findIndex(x => x.treatment_ID == ID);
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                animalsFactory.deleteTreatment(ID).then(function () {
                    $scope.treatmentHistory.splice(index, 1);
                });
            }
        });
    }



    // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Service modal $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    // add service modal
    $scope.addServiceModal = () => {
        $scope.serviceModalMode = 'add';
        $scope.serviceData = {
            animal_ID_FK: $scope.selectedAnimal.animal_ID,
            service_type: null,
            service_description: null,
            payment_currency: 'lira',
            payment_received: null,
            exchange_rate: $scope.exchangeRate.exchange_rate,
        }
        $('#serviceModal').modal('toggle');
    }

    // edit service modal

    $scope.editServiceModal = data => {
        $scope.serviceModalMode = 'edit';
        $scope.serviceData = {};
        angular.copy(data, $scope.serviceData);
        $('#serviceModal').modal('toggle');
    }

    $scope.submitService = () => {
        // $scope.serviceData.service_date = DateService.getDate();
        // $scope.serviceData.service_time = DateService.getTime();
        // animalsFactory.submitService($scope.serviceData);
        // $scope.showAnimalDetails($scope.selectedAnimal);
        switch ($scope.serviceModalMode) {
            case 'add': {
                $scope.serviceData.service_date = DateService.getDate();
                $scope.serviceData.service_time = DateService.getTime();
                animalsFactory.submitAddService($scope.serviceData);
                $scope.showAnimalDetails($scope.selectedAnimal);
                break;
            }
            case 'edit': {
                animalsFactory.submitEditService($scope.serviceData);
                $scope.showAnimalDetails($scope.selectedAnimal);
                break;
            }

        }
    }

    // delete service
    $scope.deleteService = ID => {
        let index = $scope.serviceHistory.findIndex(x => x.service_ID == ID);
        NotificationService.showWarning().then(ok => {
            if (ok.isConfirmed) {
                animalsFactory.deleteService(ID).then(function () {
                    $scope.serviceHistory.splice(index, 1);
                });
            }
        });
    }


    // &&&&&&&&&&&&&&&&&&&&&&&&&&&& Reminders Modal &&&&&&&&&&&&&&&&&&&&&&&&&&
    
    $scope.addReminderModal = () => {
        $('#remindersModal').modal('toggle');
        $scope.reminderData = {
            animal_ID_FK: $scope.selectedAnimal.animal_ID,
            reminder_name: null,
            reminder_date: null,
            reminder_notes: null,
            repeat: false,
            repeat_reminder: null
        }
    }


});