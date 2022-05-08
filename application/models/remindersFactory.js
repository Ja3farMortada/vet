app.factory('remindersFactory', ['$http', 'NotificationService', '$timeout', function ($http, NotificationService, $timeout) {

    // define url
    const url = `http://${keys.host}:${keys.port}`;

    var model = {};
    model.reminders = [];


    function test() {
        for(let i = 0; i < model.reminders.length; i++) {
            var now = moment(new Date());
            var end = (moment(model.reminders[i]['due_date'] + ' ' + model.reminders[i]['due_time']));
            var duration = moment.duration(end.diff(now));
            var timeToAlert = duration.asMilliseconds();
            $timeout(function () {
                console.log(`${i} is alerted`)
            }, timeToAlert)
        }
    }
    // get reminders functions
    const getReminders = () => {
        return $http.get(`${url}/getReminders`).then(function (response) {
            angular.copy(response.data, model.reminders);

            // test();

        }, function (error) {
            NotificationService.showError(error);
        });
    }
    model.getReminders = getReminders(); // expose function to the outer excution context

    // add reminder
    model.addReminder = data => {
        return $http.post(`${url}/addReminder`, data).then(function (response) {
            $('#remindersModal').modal('hide');
            NotificationService.showSuccess();
            angular.copy(response.data, model.reminders);
        }, function (error) {
            NotificationService.showError(error);
        });
    }

    // edit reminder
    model.editReminder = data => {
        return $http.post(`${url}/editReminder`, data).then(function (response) {
            $('#remindersModal').modal('hide');
            NotificationService.showSuccess();
            angular.copy(response.data, model.reminders);
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
}]);