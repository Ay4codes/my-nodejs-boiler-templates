const { colors } = require("../constants")

const Button = (title, url) => {
    return (`
        <a href="${url}" style="margin-top: 20px;">
            <div style="font-size: 18px; background-color: ${colors.primary}; color: ${colors.white}; text-align: center; text-decoration: none; padding: 10.5px 20px; line-height: 2.5rem; max-width: 100%; border-radius: 5px;">
                ${title}
            </div>
        </a>
    `)
}

module.exports = {Button}