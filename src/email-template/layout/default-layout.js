import { CONFIG } from '../../../config/index.js';
import constants from '../constants/index.js';
import CustomDate from '../../utils/date.js'
const colors = constants.colors


const Layout = (children) => {
    return (`
        <!DOCTYPE html>
        <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">  

                <style>
                    body {
                        font-family: 'Poppins', sans-serif;
                        font-weigth: 500;
                    }
                    p {
                        font-size: 17px;
                        text-align: center;
                        line-height: 2.5rem;
                        text-decoration: none;
                    }
                    a {
                        font-size: 17px;
                        text-align: center;
                        text-decoration: none;
                    }
                    h3 {
                        font-size: 22px;
                        text-align: center;
                    }
                    hr {
                        background-color: ${colors.deepGrey};
                        border: none;
                        height: 1px;
                    }
                </style>
            </head>
            <body>
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 20px">
                    <div style="padding: 40px 45px; max-width: 420px; min-width: 380px; border: 1px solid ${colors.deepGrey}; border-radius: 12px;">
                        ${children}
                        <br />
                        <br />
                        <hr />
                        <p style="line-height: 1rem; font-size: 14px;">© ${CONFIG.APP_NAME} ${CustomDate.year()}</p>
                        <p style="line-height: 1rem; font-size: 14px;">Easy Peasy</p>
                    </div>
                </div>
            </body>
        </html>
    `)
};

export default Layout