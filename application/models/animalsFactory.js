app.factory('animalsFactory', function ($http, NotificationService, DateService, remindersFactory) {

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

                case 2:
                    this.tabSelected = 2;
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

    // fetchAnimalReminders
    model.fetchAnimalReminders = data => {
        return $http.get(`${url}/fetchAnimalReminders/${data.animal_ID}`).then(response => {
            console.log(response.data);
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // add animal
    model.addAnimal = data => {
        return $http.post(`${url}/addAnimal`, {
            data: data
        }).then(response => {
            $('#animalModal').modal('toggle');
            NotificationService.showSuccess();
            return response.data;
        }, error => {
            NotificationService.showError(error);
        })
    }

    // edit animal
    model.editAnimal = data => {
        return $http.post(`${url}/editAnimal`, {
            data: data
        }).then(() => {
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

    model.submitAddTreatment = data => {
        $http.post(`${url}/newTreatment`, {
            data: data
        }).then(response => {
            NotificationService.showSuccess();
            $('#treatmentModal').modal('toggle');
            remindersFactory.fetchReminders()
        }, error => {
            NotificationService.showError(error);
        })
    }

    model.submitAddService = data => {
        $http.post(`${url}/newService`, {
            data: data
        }).then(response => {
            NotificationService.showSuccess();
            $('#serviceModal').modal('toggle');
            remindersFactory.fetchReminders()
        }, error => {
            NotificationService.showError(error);
        })
    }

    // delete treatment
    model.deleteTreatment = ID => {
        return $http.post(`${url}/deleteTreatment`, {
            ID: ID
        }).then(() => {
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        });
    }

    // edit treatment
    model.submitEditTreatment = data => {
        $http.post(`${url}/editTreatment`, {
            data: data
        }).then(() => {
            $('#treatmentModal').modal('toggle');
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        });
    }


    // delete Service
    model.deleteService = ID => {
        return $http.post(`${url}/deleteService`, {
            ID: ID
        }).then(() => {
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        });
    }

    // edit Service
    model.submitEditService = data => {
        $http.post(`${url}/editService`, {
            data: data
        }).then(() => {
            $('#serviceModal').modal('toggle');
            NotificationService.showSuccess();
        }, error => {
            NotificationService.showError(error);
        });
    }

    return model;
});