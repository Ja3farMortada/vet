app.factory('animalsFactory', function ($http, NotificationService, DateService, doctorsFactory) {

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

    // model.submit = data => {
    //     NotificationService.showConfirm().then(ok => {
    //         if (ok.isConfirmed) {
    //             $http.post(`${url}/addNewFilm`, data).then(() => {
    //                 model.fetchInvoices();
    //                 model.fetchSettings();
    //                 NotificationService.showSuccess();
    //                 $('#filmModal').modal('toggle');
    //                 // fetch doctors
    //                 doctorsFactory.fetchDoctors();
    //                 // fetch invoices if a doctor is selected
    //                 if (doctorsFactory.selectedID) {
    //                     doctorsFactory.getDebtsDetails({
    //                         ID: doctorsFactory.selectedID
    //                     });
    //                 }
    //             }, error => {
    //                 NotificationService.showError(error);
    //             });
    //         }
    //     })
    // }

    return model;
});