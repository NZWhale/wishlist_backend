import { sender, smtpLogin, smtpPassword, smtpPort, smtpServer } from "../../sensetiveData";
import createMessage from "../../createMail";

const nodemailer = require('nodemailer')



const sendMagicLink = (email: string, magicLink: string): Promise<ISuccess> => new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: false,
        auth: {
            user: smtpLogin,
            pass: smtpPassword
        }
    });
    let message = createMessage(magicLink)
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
          transporter.sendMail(mailDetails, function (err: Error, success: ISuccess) {
              if (err) {
                  console.log('Error Occurs :', err);
                  return reject(err)
              } else {
                  return resolve(success)
              }
          })
        }
      });

})

export interface ISuccess {
    accepted: string[],
    rejected: [],
    envelopeTime: number,
    messageTime: number,
    messageSize: number,
    response: string,
    envelope: Envelope,
    messageId: string
}
type Envelope = { from: string, to: string[] }

export default sendMagicLink