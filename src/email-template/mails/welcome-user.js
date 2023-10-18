const Layout = require("../layout/default-layout")

const WelcomeUserEmail = (firstname) => {
    
    return (
        Layout(`
            <p>${firstname} Welcome to the template</p>
        `)
    )
}

module.exports = WelcomeUserEmail