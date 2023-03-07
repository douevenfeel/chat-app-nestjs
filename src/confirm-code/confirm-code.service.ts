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

        const alreadyCreated = await this.getConfirmCodeByEmail(email);
        if (alreadyCreated) {
            alreadyCreated.confirmCode = confirmCode;
        } else {
            await this.confirmCodeRepository.create({ email, confirmCode });
        }

        await this.emailService.sendUserConfirmation(email, confirmCode);
        return { successEmail: true };
    }

    async confirm(dto: ConfirmCodeDto) {
        const { email, confirmCode } = dto;
        // TODO добавить такую же проверку в registration, если за время регистрации уже появился пользователь с таким email - ошибка
        const candidateEmail = await this.userService.getUserByEmail(email);
        if (candidateEmail) {
            // TODO прокинуть ошибку пользователь зарегистрирован уже
        }

        const candidate = await this.getConfirmCode(email, confirmCode);
        if (candidate) {
            candidate.confirmed = true;
            candidate.save();
        }

        if (!candidate) {
            // TODO ошибку прокинуть bad request неверный код
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
