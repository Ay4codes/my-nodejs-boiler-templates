const { DateTime } = require('luxon');

class customDate {
    now () {
        return Date.now()
    }

    day() {
        const day = DateTime.local().setZone('Africa/Lagos').day.toString().padStart(2, '0');
        return (day).toString();
    };

    yesterday() {
        const yesterday = DateTime.local().setZone('Africa/Lagos').minus({ days: 1 }).day.toString().padStart(2, '0');
        return yesterday;
    };

    month() {
        const month = DateTime.local().setZone('Africa/Lagos').month.toString().padStart(2, '0');
        return (month).toString();
    };

    year() {
        const year = DateTime.local().setZone('Africa/Lagos').year;
        return (year).toString();
    };

    date() {
        const day = DateTime.local().setZone('Africa/Lagos').day.toString().padStart(2, '0');
        
        const month = DateTime.local().setZone('Africa/Lagos').month.toString().padStart(2, '0');

        const year = DateTime.local().setZone('Africa/Lagos').year;

        return (day + '-' + month + '-' + year).toString()
    };

    time() {
        const time = DateTime.local().setZone('Africa/Lagos').toFormat('HH:mm');
        return (time).toString();
    }
}

module.exports = new customDate