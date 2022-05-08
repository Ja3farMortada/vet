var $ = jQuery = require('jquery');
var angular = require('angular');

require('bootstrap');

const swal = require('sweetalert2');


const keys = require('../../keys.json');


var app = angular.module('loginApp', []);

app.controller('loginController', function ($scope, $http, $timeout, NotificationService) {
    const package = require('../../package.json');

    // reset settings
    localStorage.removeItem('setting');

    // get versions
    $scope.version = package.version;

    // define server path
    const url = `http://${keys.host}:${keys.port}`;

    // autofocus username
    $('#usernameField').trigger('focus');

    $scope.showPassword = false;
    $scope.togglePassword = function () {
        $scope.showPassword = !$scope.showPassword;
    }

    $scope.credentials = {
        username: null,
        password: null
    }
    $scope.title = 'Please Login to Continue';
    $scope.loading = false;

    $scope.submit = () => {
        $scope.loading = true;
        $http.post(`${url}/login`, $scope.credentials).then(function (response) {
            if (response.status == 200) {
                if (response.data[0]) {
                    localStorage.setItem('setting', JSON.stringify(response.data[0]));
                    window.location.replace('main.html')
                } else {
                    NotificationService.playErrorSound();
                    $scope.credentials.username = null;
                    $scope.credentials.password = null;
                    $scope.loading = false;
                    $('.form-label-group').addClass('animate__shakeX');
                    $scope.title = 'Error username or password!!'
                    $timeout(function () {
                        $scope.title = 'Please Login to Continue';
                        $('#usernameField').trigger("focus");
                    }, 1000);
                }
            }
        }, function (error) {
            $scope.credentials.username = null;
            $scope.credentials.password = null;
            $scope.loading = false;
            let errorText;
            console.log(error)
            if (error.status == -1) {
                errorText = "Node server is offline, try restarting the application"
            } else if (error.data.sqlMessage) {
                errorText = error.data.sqlMessage;
            } else {
                errorText = error.data;
            }
            swal.fire({
                title: 'ERROR!',
                text: `${errorText}`,
                icon: 'error'
            });
        });
    };
});
require('../services/notificationService')