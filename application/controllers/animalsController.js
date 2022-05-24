app.controller('animalsController', function ($scope, animalsFactory, DateService, NotificationService) {

    // get logged in user type
    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    $scope.moment = moment;

    // get animals
    $scope.animals = animalsFactory.animals;
    let modalMode;

    // tab selection
    $scope.tabSelected = animalsFactory.tabSelected;
    $scope.selectTab = tab => {
        animalsFactory.selectTab(tab);
        $scope.selectedTab = animalsFactory.selectedTab;
    };

    // define datepicker value
    // $scope.datePickerValue = historyFactory.datePickerValue;
    function datepicker() {
        $('#birthdatePicker').datepicker({
            dateFormat: 'yy-mm-dd',
            maxDate: DateService.getDate(),
            onSelect: function () {
                var d = $('#birthdatePicker').datepicker({
                    dateFormat: 'yy-mm-dd'
                }).val();
                $scope.$digest($scope.animalData.birthdate = d);
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
            phone_number: null,
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
                $scope.animals.push(response);
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
    }

    $scope.isActive = ID => {
        return $scope.activeRow === ID;
    };

});