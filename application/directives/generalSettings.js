app.directive('generalSettings', function (generalFactory) {
    return {
        restrict: 'E',
        templateUrl: '../templates/generalSettings.html',
        scope: {

        },
        link: function (scope) {

            scope.backupDB = function () {
                generalFactory.backupDB();
            }
        }
    }
});