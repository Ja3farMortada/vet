app.service('DateService', function () {

    this.getDay = () => {
        var d = new Date();
        return d.getDate();
    }

    this.getMonth = () => {
        var d = new Date();
        months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        return months[d.getMonth()];
    }

    this.getHour = () => {
        var d = new Date();
        return d.getHours();
    }

    this.getDate = () => {
        var d = new Date();
        months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        return d.getFullYear() + '-' + months[d.getMonth()] + '-' + d.getDate();
    };

     this.getTime = () => {
        var d = new Date();
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };
});