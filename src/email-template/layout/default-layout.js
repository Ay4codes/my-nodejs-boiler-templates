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
                    /* Removed text-align: center from general elements */
                    p {
                        font-size: 17px;
                        line-height: 1.6;
                        text-decoration: none;
                        margin-top: 15px;
                        margin-bottom: 15px;
                    }
                    a {
                        font-size: 17px;
                        text-decoration: none;
                    }
                    h3 {
                        font-size: 22px;
                        margin-top: 0;
                        margin-bottom: 25px;
                    }
                    hr {
                        background-color: ${colors.deepGrey};
                        border: none;
                        height: 1px;
                        margin-top: 25px;
                        margin-bottom: 25px;
                    }
                    /* Ensure button is centered or full-width */
                    .button-container {
                        text-align: center;
                        margin-top: 30px;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div style="display: flex; justify-content: center; width: 100%; margin-top: 20px">
                    <div style="
                        padding: 40px 45px; 
                        max-width: 550px; /* Increased max width for more standard look */
                        min-width: 450px; 
                        border: 1px solid ${colors.deepGrey}; 
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
                    ">
                        ${children}
                        <br />
                        <br />
                        <hr />
                        <p style="text-align: center; line-height: 1rem; font-size: 14px;">© ${CONFIG.APP_NAME} ${CustomDate.year()}</p>
                        <p style="text-align: center; line-height: 1rem; font-size: 14px;">Easy Peasy</p>
                    </div>
                </div>
            </body>
        </html>
    `)
};

export default Layout