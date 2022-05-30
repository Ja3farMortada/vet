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
    // function test() {
    //     for(let i = 0; i < model.reminders.length; i++) {
    //         var now = moment(new Date());
    //         var end = (moment(model.reminders[i]['due_date'] + ' ' + model.reminders[i]['due_time']));
    //         var duration = moment.duration(end.diff(now));
    //         var timeToAlert = duration.asMilliseconds();
    //         $timeout(function () {
    //             console.log(`${i} is alerted`)
    //         }, timeToAlert)
    //     }
    // }
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
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // finish reminder
    let index
    model.removeReminder = ID => {
        return $http.post(`${url}/removeReminder`, {
            "ID": ID
        }).then(function (response) {
            index = model.reminders.findIndex(x => x.reminder_ID == ID);
            // model.reminders.splice(index, 1);
            // angular.copy(response.data, model.reminders);
            NotificationService.showSuccessToast();
            return index;
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    return model;
});