app.service('NotificationService', ['$timeout', function ($timeout) {

    let successAudio = new Audio('../assets/ding-sound.mp3');
    let cashAudio = new Audio('../assets/cash-sound.mp3');
    let error1Audio = new Audio('../assets/error-1.mp3');
    let error2Audio = new Audio('../assets/error-2.wav');

    this.showSuccess = () => {
        successAudio.play();
        Swal.fire({
            title: ' ',
            text: 'Process Completed Successfully!',
            icon: 'success',
            position: 'bottom-end',
            toast: true,
            background: 'green',
            timer: 2000,
            showConfirmButton: false
        });
    };

    this.showError = error => {
        Swal.fire({
            title: 'ERROR!',
            text: `${error.data.sqlMessage}`,
            icon: 'error'
        });
    };

    this.showErrorText = text => {
        error2Audio.play();
        Swal.fire({
            title: 'ERROR!',
            text: `${text}`,
            icon: 'error'
        });
    }

    this.promiseError = text => {
        error2Audio.play();
        return Swal.fire({
            title: 'ERROR!',
            text: `${text}`,
            icon: 'error',
            returnFocus: false
        });
    }

    this.showSuccessToast = () => {
        successAudio.play();
        Swal.fire({
            title: ' ',
            text: 'Process Completed Successfully!',
            icon: 'success',
            position: 'bottom-end',
            toast: true,
            background: 'green',
            timer: 2000,
            showConfirmButton: false
        });
    };

    this.showSuccessCash = () => {
        cashAudio.play();
        Swal.fire({
            title: ' ',
            text: 'Process Completed Successfully!',
            icon: 'success',
            position: 'bottom-end',
            toast: true,
            background: 'green',
            timer: 2000,
            showConfirmButton: false
        });
    };

    this.showErrorToast = text => {
        error2Audio.play();
        Swal.fire({
            title: 'ERROR!',
            text: `${text || 'An Error Has Occured!'}`,
            icon: 'error',
            position: 'top-end',
            toast: true,
            background: '#DB2828',
            timer: 3000,
            showConfirmButton: false
        });
    };

    this.showConfirm = () => {
        return Swal.fire({
            title: "CONFIRM",
            text: "Are you sure you want to proceed?",
            icon: "question",
            showCancelButton: true,
            focusConfirm: true,
            reverseButtons: false
        });
    };

    this.showWarning = () => {
        return Swal.fire({
            title: "WARNING",
            text: "Are you sure you want to proceed?",
            icon: "error",
            showCancelButton: true,
            focusConfirm: false,
            reverseButtons: true
        });
    };

    this.playErrorSound = () => {
        error2Audio.play();
    };

}]);