app.factory('animalsFactory', function ($http, NotificationService, DateService) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.tabSelected = 0;
    model.animals = [];

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

    // Get animals
    const getAnimals = () => {
        $http.get(`${url}/getAnimals`).then(response => {
            angular.copy(response.data, model.animals);
        }, error => {
            NotificationService.showError(error);
        })
    }
    getAnimals();

    // fetch animals
    model.fetchAnimals = () => {
        getAnimals();
    }

    // fetchTreatmentHistory
    model.fetchTreatmentHistory = data => {
        return $http.get(`${url}/fetchTreatmentHistory`, {
            params: {
                "ID": data.animal_ID
            }
        }).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }
    // fetchServiceHistory
    model.fetchServiceHistory = data => {
        return $http.get(`${url}/fetchServiceHistory`, {
            params: {
                "ID": data.animal_ID
            }
        }).then(response => {
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // add animal
    model.addAnimal = data => {
        return $http.post(`${url}/addAnimal`, {data: data}).then(response => {
            $('#animalModal').modal('toggle');
            NotificationService.showSuccess();
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // edit animal
    model.editAnimal = data => {
        return $http.post(`${url}/editAnimal`, {data: data}).then(() => {
            $('#animalModal').modal('toggle');
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        });
    }

    // Delete Items
    model.deleteAnimal = function (ID) {
        return $http.post(`${url}/deleteAnimal`, ID).then(function () {
            NotificationService.showSuccess();
        }, function (error) {
            NotificationService.showError(error);
        });
    };

    model.submitTreatment = data => {
        $http.post(`${url}/newTreatment`, {data: data}).then(response => {
            NotificationService.showSuccess();
            $('#treatmentModal').modal('toggle');
        }, error => {
            NotificationService.showError(error);
        })
    }

    model.submitService = data => {
        $http.post(`${url}/newService`, {data: data}).then(response => {
            NotificationService.showSuccess();
            $('#serviceModal').modal('toggle');
        }, error => {
            NotificationService.showError(error);
        })
    }

    return model;
});