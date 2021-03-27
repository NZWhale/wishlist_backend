import { sender, smtpLogin, smtpPassword, smtpPort, smtpServer } from "../../addresses";
import createEmailMessage from "./createEmaiMessage";

const nodemailer = require('nodemailer')



const sendMagicLink = (email: string, magicLink: string) => new Promise((resolve, reject) => {
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

    transporter.verify(function(error: Error) {
        if (error) {
          console.log(error);
          return reject(error)
        } else {
          console.log("Server is ready to take our messages");
          transporter.sendMail(mailDetails, function (err: Error, success: any) {
              if (err) {
                  console.log('Error Occurs :', err);
                  return reject(err)
              } else {
                  console.log('Email sent successfully');
                  return resolve(success)
              }
          })
        //   return resolve(success)
        }
      });

})

export default sendMagicLink