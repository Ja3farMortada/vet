app.controller(
  "remindersController",
  function ($scope, remindersFactory, NotificationService, DateService) {
    // bind reminders to application model
    $scope.reminders = remindersFactory.reminders;
    $scope.upcomingReminders = remindersFactory.upcomingReminders;
    console.log($scope.upcomingReminders);

    // bind moment function with a scope to use it in view
    $scope.moment = moment;

    // Tabs selection
    $scope.tabSelected = remindersFactory.tabSelected;
    $scope.selectTab = tab => {
      if (tab != remindersFactory.tabSelected) {
        remindersFactory.selectTab(tab);
        $scope.tabSelected = remindersFactory.tabSelected;
        $scope.items = null;
        $scope.activeRow = null;
        $scope.user = null;
      }
    };

    // open add reminder modal
    $scope.openReminderModal = function (type, ID) {
      switch (type) {
        case "add":
          addReminderModal();
          break;
        case "edit":
          editReminderModal(ID);
          break;
      }
    };

    function datepicker() {
      $("#reminderDatePicker")
        .datepicker({
          dateFormat: "yy-mm-dd",
          onSelect: function () {
            var d = $("#reminderDatePicker")
              .datepicker({
                dateFormat: "yy-mm-dd",
              })
              .val();
            // historyFactory.datePickerValue = d;
            $scope.$digest(($scope.data.due_date = d));
          },
        })
        .datepicker("setDate", null);
    }
    datepicker();

    function addReminderModal() {
      $scope.modalTitle = "Add Reminder";
      $scope.data = {
        reminder_title: null,
        reminder_text: null,
        reminder_type: "task",
        due_date: null,
        due_time: null,
        repeat_reminder: null,
      };
      $("#remindersModal").modal("show");
      $("#remindersModal").on("shown.bs.modal", function () {
        $(this).find("[autofocus]").trigger("focus");
      });
    }

    // open edit reminder modal
    let index;

    function editReminderModal(ID) {
      $scope.modalTitle = "Edit Reminder";
      index = $scope.reminders.findIndex(index => index.reminder_ID == ID);
      $scope.data = {};
      angular.copy($scope.reminders[index], $scope.data);
      $("#remindersModal").modal("show");
    }

    $scope.submit = function () {
      switch ($scope.modalTitle) {
        case "Add Reminder":
          submitAddReminder();
          break;
        case "Edit Reminder":
          submitEditReminder();
          break;
      }
    };

    var timeInput = document.getElementById("timeInput");

    // submit add reminder function
    function submitAddReminder() {
      // console.log(moment($scope.data.due_time).format('HH:mm:ss'))
      // $scope.data.selectedTime = moment($scope.data.due_time).format('HH:mm:ss');
      $scope.data.due_time = `${timeInput.value}:00`;
      remindersFactory.addReminder($scope.data);
    }
    //submint edit reminder function
    function submitEditReminder() {
      if ($scope.data.reminder_type == "task") {
        $scope.data.due_date = null;
        $scope.data.due_time = null;
      }
      $scope.data.due_time = `${timeInput.value}`;
      remindersFactory.editReminder($scope.data);
    }

    $scope.removeReminder = data => {
      NotificationService.showWarning().then(ok => {
        if (ok.isConfirmed) {
          remindersFactory.removeReminder(data);
        }
      });
    };

    $scope.markNotified = data => {
      NotificationService.showWarning().then(ok => {
        if (ok.isConfirmed) {
          remindersFactory.markNotified(data);
        }
      });
    };
  }
);
