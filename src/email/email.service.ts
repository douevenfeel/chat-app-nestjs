import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(email: string, confirmCode: string) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to VK! Confirm your Email',
            template: './confirmCode', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                confirmCode,
            },
        });
    }
}

