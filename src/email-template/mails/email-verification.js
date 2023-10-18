const Layout = require("../layout/default-layout")

const EmailVerificationEmail = (firstname) => {

    return (
        Layout(`
            <section>
                <h3>Hi ${firstname} 👋</h3>
                <p>Email verification !!!</p>
            </section>
        `)
    )

}

module.exports = EmailVerificationEmail