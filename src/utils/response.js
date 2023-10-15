const response = (status, message, data, issue) => {
    return {
        status: status,
        message: message,
        data: data,
        issue: issue
    }
}

module.exports = (response)