import { Injectable } from "@nestjs/common";
import nodemailer, { TransportOptions } from 'nodemailer'

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    } as TransportOptions)

    async sendVerificationCode(email: string, code: number) {
        await this.transporter.sendMail({
            from: `"Cinematica" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verification Code",
            html: `Your verification code: <strong>${code}</strong>`
        })
    }

    async sendResetToken(email: string, token: string) {
        await this.transporter.sendMail({
            from: `"Cinematica" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset",
            html: `<a href="${process.env.CLIENT_URL}/reset?token=${token}">Reset my password</a>`
        })
    }
}