import { UsersService } from './../users/users.service';
import { EmailService } from './../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfirmCode } from './confirm-code.model';
import { User } from 'src/users/users.model';
import { CreateConfirmCodeDto } from './dto/create-confirm-code.dto';

@Injectable()
export class ConfirmCodeService {
    constructor(
        @InjectModel(ConfirmCode)
        private confirmCodeRepository: typeof ConfirmCode,
        private emailService: EmailService,
        private userService: UsersService
    ) {}

    async generateCode(dto: CreateConfirmCodeDto) {
        const { email } = dto;
        const confirmCode = uuidv4().slice(0, 6);
        const candidate = await this.userService.getUserByEmail(email);
        if (candidate) {
            // TODO ошибка адекватная
            return 'error';
        }

        const alreadyCreated = this.getConfirmCodeByEmail(email);
        if (alreadyCreated) {
            // TODO перезаписать код для этой почты
            return 'already';
        } else {
            await this.confirmCodeRepository.create({ email, confirmCode });
        }

        await this.emailService.sendUserConfirmation(email, confirmCode);
        return { successEmail: true };
    }

    async confirm(dto: ConfirmCodeDto) {
        const { email, confirmCode } = dto;
        const candidate = await this.getConfirmCode(email, confirmCode);

        // TODO если за время подтверждения почта стала занята и пользователь теперь зареган, прокидывать ошибку пользователь уже зарегистрирован

        if (!candidate) {
            // TODO ошибку прокинуть неверный код
            return 'error';
        }

        return { isConfirmed: true };
    }

    async getConfirmCode(email: string, confirmCode: string) {
        const candidate = await this.confirmCodeRepository.findOne({
            where: { email, confirmCode },
        });

        return candidate;
    }

    async getConfirmCodeByEmail(email: string) {
        const confirmCode = await this.confirmCodeRepository.findOne({
            where: { email },
        });

        return confirmCode;
    }
}
