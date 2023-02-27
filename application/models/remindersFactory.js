app.factory('remindersFactory', function ($http, NotificationService, $timeout) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.reminders = [];
    model.upcomingReminders = [];

    //tab selection
    model.tabSelected = 0;
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


    const getUpcomingReminders = () => {
        $http.get(`${url}/getUpcomingReminders`).then(function (response) {
            angular.copy(response.data, model.upcomingReminders);
        }, function (error) {
            NotificationService.showError(error);
        });
    }
    getUpcomingReminders();

    model.fetchReminders = () => {
        getUpcomingReminders();
        getReminders();
    }

    // get reminders functions
    const getReminders = () => {
        $http.get(`${url}/getReminders`).then(function (response) {
            angular.copy(response.data, model.reminders);

            // test();

        }, function (error) {
            NotificationService.showError(error);
        });
    }
    getReminders(); // expose function to the outer excution context

    // add reminder
    model.addReminder = data => {
        return $http.post(`${url}/addReminder`, data).then(function (response) {
            $('#remindersModal').modal('hide');
            NotificationService.showSuccess();
            // angular.copy(response.data, model.reminders);
            model.fetchReminders()
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // edit reminder
    model.editReminder = data => {
        return $http.post(`${url}/editReminder`, data).then(function (response) {
            $('#remindersModal').modal('hide');
            NotificationService.showSuccess();
            // angular.copy(response.data, model.reminders);
            model.fetchReminders()
            return 'success'
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // finish reminder
    let index
    model.removeReminder = reminder => {
        return $http.post(`${url}/removeReminder`, reminder).then(function (response) {
            NotificationService.showSuccess();
            model.fetchReminders();
            return 'success'
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    model.deleteReminder = reminder => {
        return $http.post(`${url}/deleteReminder`, reminder).then(function (response) {
            NotificationService.showSuccess();
            model.fetchReminders();
            return 'success'
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    return model;
});