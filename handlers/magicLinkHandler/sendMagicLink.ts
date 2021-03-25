import { sender, smtpLogin, smtpPassword, smtpPort, smtpServer } from "../../addresses";
import createEmailMessage from "./createEmaiMessage";

const nodemailer = require('nodemailer')



function sendMagicLink(email: string, magicLink: any) {
    let transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: false,
        auth: {
            user: smtpLogin,
            pass: smtpPassword
        }
    });
    let message = createEmailMessage(magicLink)
    let mailDetails = {
        from: sender,
        to: email,
        subject: "Doobki's Wish List",
        html: message
    };

    transporter.verify(function(error: Error, success: any) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });

    transporter.sendMail(mailDetails, function (err: Error) {
        if (err) {
            console.log('Error Occurs :', err);
        } else {
            console.log('Email sent successfully');
        }
    })
}

export default sendMagicLink