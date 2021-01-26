const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
    constructor(user, url) {
        this.from = `Elan <${process.env.EMAIL_FROM}>`;
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
    }

    createTransport() {
        if (process.env.NODE_ENV === 'production') {
            const transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
            return transporter;
        }
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        return transporter;
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject,
        });

        const mailConfig = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        };

        await this.createTransport().sendMail(mailConfig);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Emploi');
    }

    async sendResetPassword() {
        await this.send(
            'Reset Password',
            'Your Password Reset URL (Valid only for 10 minutes)'
        );
    }
}

module.exports = Email;
