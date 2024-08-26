app.directive('accountSettings', function (accountFactory, NotificationService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/accountSettings.html',
        scope: {

        },
        link: function (scope) {

            scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));

            // bind users to model factory
            scope.users = accountFactory.users;

            // Open Edit Username Modal
            scope.openEditUsernameModal = function () {
                $('#editUsernameModal').modal('show');
                $('#editUsernameModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
                scope.newUsername = null;
            };

            // Prevent spacing in change user modal and add user modal
            $(function () {
                $('#newUsername').on('keypress', function (e) {
                    if (e.which == 32)
                        return false;
                });
                $('#createUsername').on('keypress', function (e) {
                    if (e.which == 32)
                        return false;
                });
            });

            // Change Username function
            scope.changeUsername = function () {
                if (scope.newUsername && scope.newUsername.indexOf(' ') === -1) {
                    var exist = false;
                    for (var i = 0; i < scope.users.length; i++) {
                        if (scope.users[i]['username'].includes(scope.newUsername)) {
                            exist = true;
                            NotificationService.showWarning().then(result => {
                                if (result.isConfirmed) {
                                    scope.$digest(scope.newUsername = null);
                                    $('#newUsername').trigger('focus');
                                }
                            });
                            break;
                        }
                    }
                    if (exist == false) {
                        accountFactory.editUsername({
                            ID: scope.loggedInUser.UID,
                            newUsername: scope.newUsername
                        }).then(function () {
                            scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));
                        });
                    }
                }
            };

            // Open Change Password Modal
            scope.openChangePasswordModal = function () {
                $('#changePasswordModal').modal('show');
                $('#changePasswordModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
                scope.oldPassword = null;
                scope.newPassword = null;
                scope.confirmPassword = null;
            };
            // Change Password function
            scope.changePassword = function () {
                if (md5(scope.oldPassword) === scope.loggedInUser.password) {
                    if (scope.newPassword === scope.confirmPassword) {
                        accountFactory.changePassword({
                            ID: scope.loggedInUser.UID,
                            password: scope.confirmPassword
                        }).then(function () {
                            scope.loggedInUser = JSON.parse(localStorage.getItem('setting'));
                        });
                    } else {
                        NotificationService.promiseError(`Passwords didn't match!`).then(() => {
                            scope.$digest(scope.newPassword = null);
                            scope.$digest(scope.confirmPassword = null);
                            $('#newPassword').trigger('focus');
                        });
                    }
                } else {
                    NotificationService.promiseError(`Old password is incorrect, please check your entries`).then(() => {
                        scope.$digest(scope.oldPassword = null);
                        scope.$digest(scope.newPassword = null);
                        scope.$digest(scope.confirmPassword = null);
                        $('#oldPassword').trigger('focus');
                    });
                }
            };


            // Open Add User Modal
            scope.openAddUserModal = function () {
                $('#addUserModal').modal('show');
                $('#addUserModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').trigger('focus');
                });
                scope.createUsername = null;
                scope.createPassword = null;
                scope.confirmCreatePassword = null;
                scope.owner = null;
            };
            // add User function
            scope.addUser = function () {
                if (scope.createUsername.indexOf(' ') === -1) {
                    if (scope.createPassword === scope.confirmCreatePassword) {
                        accountFactory.addUser({
                            username: scope.createUsername,
                            password: scope.createPassword,
                            owner: scope.owner
                        });
                    } else {
                        NotificationService.promiseError(`Passwords didn't match!`).then(() => {
                            scope.$digest(scope.createPassword = null);
                            scope.$digest(scope.confirmCreatePassword = null);
                            $('#createPassword').trigger('focus');
                        });
                    }
                }
            };

            // open edit user modal
            scope.openEditUserModal = function (index) {
                $('#editUserModal').modal('show');
                $('#editUserModal').on('shown.bs.modal', function () {
                    $(this).find('[autofocus]').focus();
                });
                scope.selectedUserID = scope.users[index]['UID'];
                scope.editUsername = scope.users[index]['username'];
                scope.editOwner = scope.users[index]['owner'];
            };
            // Update function
            scope.editUser = function () {
                accountFactory.editUser({
                    ID: scope.selectedUserID,
                    username: scope.editUsername,
                    owner: scope.editOwner
                });
            };
            // Delete function
            scope.deleteUser = function () {
                NotificationService.showWarning().then(result => {
                    if (result.isConfirmed) {
                        accountFactory.deleteUser({
                            ID: scope.selectedUserID
                        });
                    }
                });
            };

            // Open Permissions Modal
            scope.openPermissionsModal = function (index) {
                $('#permissionsModal').modal('show');
                scope.selectedUser = scope.users[index];
                scope.options = [{
                        value: 0,
                        syntax: 'No'
                    },
                    {
                        value: 1,
                        syntax: 'Yes'
                    }
                ];
                scope.selectedUserID = scope.selectedUser.UID;
                scope.canAddService = scope.options[scope.selectedUser.canAddService]['value'];
                scope.canAddItem = scope.options[scope.selectedUser.canAddItem]['value'];
                scope.canViewCustomers = scope.options[scope.selectedUser.canViewCustomers]['value'];
                scope.canViewPayments = scope.options[scope.selectedUser.canViewPayments]['value'];
            };
            // update permissions function
            scope.updatePermissions = function () {
                NotificationService.showWarning().then(result => {
                    if (result.isConfirmed) {
                        accountFactory.updatePermissions({
                            ID: scope.selectedUserID,
                            canAddService: scope.canAddService,
                            canAddItem: scope.canAddItem,
                            canViewCustomers: scope.canViewCustomers,
                            canViewPayments: scope.canViewPayments
                        });
                    }
                });
            };

            // Disable user function
            scope.updateUserStatus = function (ID, username) {
                NotificationService.showWarning().then(result => {
                    if (result.isConfirmed) {
                        accountFactory.updateUserStatus({
                            UID: ID
                        });
                    }
                });
            };
        }
    }
});