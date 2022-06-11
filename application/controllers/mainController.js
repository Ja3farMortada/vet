// require jQuery and jquery datepicker
var $ = jQuery = require('jquery');
var datepicker = require('jquery-ui/ui/widgets/datepicker');

// require angular and angular-route
var angular = require('angular');
var ngRoute = require('angular-route');

var moment = require('moment');
moment().format();

// require sweetalert
var Swal = require('../../node_modules/sweetalert2/dist/sweetalert2');

// require bootstrap 4
// require('popper.js');
// require('bootstrap')
require('../../node_modules/bootstrap/dist/js/bootstrap.bundle');
// require chart.js
// var Chart = require('chart.js');

// require fontawesome
require('@fortawesome/fontawesome-free');

require('angular-animate');
require('angular-messages');
require('angular-material');

// require md5 
var md5 = require('md5');

const keys = require('../../keys.json');

require('angular-utils-pagination');

const {
    ipcRenderer
} = require('electron');

// Main angular app
const app = angular.module('mainApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'angularUtils.directives.dirPagination']);

// configure routes
app.config(function ($routeProvider) {

    $routeProvider

        .when('/animals', {
            templateUrl: 'animals.html',
            controller: 'animalsController'
        })

        .when('/sell', {
            templateUrl: 'sell.html',
            controller: 'sellController'
        })


        .when('/supply', {
            templateUrl: 'supply.html',
            controller: 'supplyController'
        })

        .when('/stock', {
            templateUrl: 'stock.html',
            controller: 'stockController'
        })

        .when('/history', {
            templateUrl: 'history.html',
            controller: 'historyController'
        })

        .when('/debts', {
            templateUrl: 'debts.html',
            controller: 'debtsController'
        })

        .when('/suppliers', {
            templateUrl: 'suppliers.html',
            controller: 'suppliersController'
        })

        .when('/doctors', {
            templateUrl: 'doctors.html',
            controller: 'doctorsController'
        })

        .when('/payments', {
            templateUrl: 'payments.html',
            controller: 'paymentsController'
        })

        .when('/reports', {
            templateUrl: 'reports.html',
            controller: 'reportsController'
        })

        .when('/reminders', {
            templateUrl: 'reminders.html',
            controller: 'remindersController'
        })

        .when('/settings', {
            templateUrl: 'settings.html',
            controller: 'settingsController'
        })

        .otherwise({
            redirectTo: '/animals'
        });

});


// get and set methods for logged in user
// app.factory('LoggedInUser', function () {
//     var user = JSON.parse(localStorage.getItem('setting'));
//     return {
//         get: function () {
//             return user;
//         },
//         set: function (obj) {
//             user = obj;
//             return user;
//         }
//     }
// });
app.factory('mainFactory', function($location) {
    var model = {};

    model.location = $location.$$path || '/animals';
    return model;
})
// Main Controller
app.controller('mainController', function ($scope, $timeout, $http, $interval, remindersFactory, DateService, mainFactory, $location) {
    const package = require('../../package.json');

    
    // $scope.$watch('$location.$$path', function () {
    //     console.log('called')
    //     $scope.location = $location.$$path;
    // })
    $scope.location = mainFactory.location;
    $scope.clickedTab = tab => {
        $scope.location = tab;
    }


    // count reminders
    $scope.remindersCount = remindersFactory.upcomingReminders;

    angular.element(document).ready(() => {
        $scope.check();
    });


    $('#successToast').toast('show');
    $('#errorToast').toast('show');

    $timeout(function () {
        $('#successToast').toast('hide');
        $('#errorToast').toast('hide');
    }, 150);

    // get version
    $scope.package = package;

    // get logged in user
    $scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

    // check if logged in
    $scope.check = async () => {
        if ($scope.loggedInUser.type != 'admin' && $scope.loggedInUser.type != 'user') {
            await window.location.replace('login.html');
        };
    };

    $scope.about = function () {
        $('#aboutModal').modal('show');
    };



    $scope.checked = false;
    $scope.showSpinner = false;
    $scope.download = false;
    $scope.downloaded = false;
    $scope.downloading = false;

    $scope.openUpdateModal = function () {
        $scope.text = null;
        $('#updateModal').modal('show');
    };
    $scope.checkForUpdates = function () {
        $scope.checked = true;
        $scope.text = null;
        ipcRenderer.send('update');
    };
    $scope.downloadUpdate = function () {
        $scope.download = false;
        $scope.showSpinner = true;
        ipcRenderer.send('download');
    }

    // render messages from server
    ipcRenderer.on('checking-for-update', function (event, data) {
        $scope.$digest($scope.showSpinner = true);
        $scope.$digest($scope.text = data);
    });
    ipcRenderer.on('update-available', function (event, data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.download = true);
        $scope.$digest($scope.text = `version ${data.version} is available.`);
    });
    ipcRenderer.on('up-to-date', function (event, data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.checked = false);
        $scope.$digest($scope.text = `your current version is up-to-date.`);
        console.log(data);
    });
    ipcRenderer.on('error', function (event, data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.checked = false);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.text = `an error has occured!.`);
        console.log(data);
    });
    ipcRenderer.on('downloading', function (event, data) {
        $scope.$digest($scope.showSpinner = false);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.downloading = true);
        $scope.$digest($scope.data = data);
        $scope.$digest($scope.text = `Downloading: ${data.percent.toFixed(2)}%`)
        $('#progressBar').css("width", data.percent + "%");
        console.log(data);
    });
    ipcRenderer.on('downloaded', function (event, data) {
        $scope.$digest($scope.downloading = false);
        $scope.$digest($scope.downloaded = true);
        $scope.$digest($scope.download = false);
        $scope.$digest($scope.text = `Ready to install version ${data.version} of size ${((data.files[0]['size'])/1000000).toFixed(2)} MB.`)
    });

    $scope.applyUpdate = function () {
        ipcRenderer.send('applyUpdate');
    };

    $scope.logout = function () {
        Swal.fire({
                title: "WARNING",
                text: "Are you sure you want to logout?",
                icon: "question",
                iconHtml: '?',
                showCancelButton: true,
                reverseButtons: true,
                // focusConfirm: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('setting');
                    window.location.replace('login.html');
                }
            });
    };
});


// require SPA controllers
require('../controllers/supplyController');
require('../controllers/sellController');
require('../controllers/animalsController');
require('../controllers/stockController');
require('../controllers/historyController');
require('../controllers/debtsController');
require('../controllers/suppliersController');
require('../controllers/doctorsController');
require('../controllers/paymentsController');
require('../controllers/reportsController');
require('../controllers/remindersController');
require('../controllers/settingsController');


// require SPA Models
require('../models/supplyFactory');
require('../models/sellFactory');
require('../models/animalsFactory');
require('../models/stockFactory');
require('../models/historyFactory');
require('../models/debtsFactory');
// require('../models/doctorsFactory');
require('../models/paymentsFactory');
require('../models/reportsFactory');
require('../models/remindersFactory');
require('../models/settingsFactory');
// custom directive's models
require('../models/accountFactory');
require('../models/generalFactory');
// require('../models/suppliersFactory');
// require('../models/customersFactory');
require('../models/stockModel');

//require Application Services
require('../services/notificationService');
require('../services/dateService');

//require Directives
require('../directives/generalSettings');
require('../directives/accountSettings');
// require('../directives/customersSettings');
// require('../directives/suppliersSettings');
require('../directives/stockSettings');
// require('../directives/doctorsSettings');


//                             *** Very useful javaScript methods ***

// includes(): checks for an existence of a string in an array and returns boolean, it is case sensitive

// some(): same as includes() but it takes function as an argument not a string

// every(): same as some() but it requires that all elements has the condition true 

// filter(): it creates a new array with elements that met a specified condition

// map(): it creates a new array with modified value of each element

// reduce(): it loops through the array and converts it to something else according to a given conditions and parameters, for example it is used to calculate the sum of prices in an array of objects

// PRINTS THE NUMBER OF WATCHERS PER PAGE
// (function () { 
//     var root = $(document.getElementsByTagName('body'));
//     var watchers = [];

//     var f = function (element) {
//         if (element.data().hasOwnProperty('$scope')) {
//             angular.forEach(element.data().$scope.$$watchers, function (watcher) {
//                 watchers.push(watcher);
//             });
//         }

//         angular.forEach(element.children(), function (childElement) {
//             f($(childElement));
//         });
//     };

//     f(root);

//     console.log(watchers.length);
// })();