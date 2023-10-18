const Layout = require("../layout/default-layout")

const WelcomeUserEmail = (firstname) => {

    return (
        Layout(`
            <section>
                <h3>Hi ${firstname} 👋</h3>
                <p>Welcome to the template. Enjoy !!!</p>
            </section>
        `)
    )

}

module.exports = WelcomeUserEmail