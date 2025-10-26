import CustomDate from './date.js'

const response = (status, message, data, issue) => {
    return {
        status: status,
        message: message,
        data: data,
        issue: issue,
        timestamp: CustomDate.getTimeStamp().date_unix
    }
}

export default response