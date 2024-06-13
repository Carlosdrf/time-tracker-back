import fs from 'fs'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

transport.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log(success);
        console.log("Server is ready to take your messages");
    }
});

export const Mailer = ({
    sendMail: async (req) => {
        const { name, lastname, phone, email, englishLevel } = req.body

        return new Promise((resolve, reject) => {
            transport.sendMail({
                from: process.env.EMAIL,
                to: process.env.SEND_TO,
                subject: `Application!: ${name} ${lastname} - I-nimble.com`,
                text: `Nombre: ${name} ${lastname}\nTelefono: ${phone} \nCorreo: ${email} \nEnglish Level: ${englishLevel}`,
                attachments: [{
                    filename: req.file.originalname,
                    path: req.file.path
                }]
            }, (error, info) => {
                fs.unlinkSync(req.file.path)
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info.response);
                }
            });
        })
    }
})

