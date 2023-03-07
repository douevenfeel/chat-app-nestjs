import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/users/users.model';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(email: string, confirmCode: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to VK! Confirm your Email',
            template: './confirmCode',
            context: {
                confirmCode,
            },
        });
    }

    async sendUserRegistration(user: User, confirmCode: string) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to VK!',
            template: './registration',
            context: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
}
