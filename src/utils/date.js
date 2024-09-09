import { DateTime } from "luxon";

class CustomDate {

    getTimeStamp() {

        const now = DateTime.now();
    
        const unixTimestamp = Math.floor(now.toMillis() / 1000);
    
        return {date_unix: unixTimestamp}
    
    }

    now () {

        const date = Date.now()

        return date

    }

    day() {

        const day = DateTime.local().setZone('Africa/Lagos').day.toString().padStart(2, '0');

        return (day).toString();
    
    };

    month() {

        const month = DateTime.local().setZone('Africa/Lagos').month.toString().padStart(2, '0');
        
        return (month).toString();
    
    };

    year() {

        const year = DateTime.local().setZone('Africa/Lagos').year;
        
        return (year).toString();
    
    };

}

export default new CustomDate