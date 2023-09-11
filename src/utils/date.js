const { DateTime } = require('luxon');

class Date {
    async day() {
        const day = DateTime.local().setZone('Africa/Lagos').day.toString().padStart(2, '0');
        return (day).toString();
    };

    async yesday() {
        const yesterday = DateTime.local().setZone('Africa/Lagos').minus({ days: 1 }).day.toString().padStart(2, '0');
        return yesterday;
    };

    async month() {
        const month = DateTime.local().setZone('Africa/Lagos').month.toString().padStart(2, '0');
        return (month).toString();
    };

    async year() {
        const year = DateTime.local().setZone('Africa/Lagos').year;
        return (year).toString();
    };

    async date() {
        const date = Date.now();
        return (date).toString();
    };

    async time() {
        const time = DateTime.local().setZone('Africa/Lagos').toFormat('HH:mm');
        return (time).toString();
    }
}

export default new Date()