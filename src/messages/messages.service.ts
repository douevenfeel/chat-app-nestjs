import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { forwardRef } from '@nestjs/common/utils';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message) private messageRepository: typeof Message
    ) {}

    async findMessagesByChat(id: number) {
        const messages = await this.messageRepository.findAll({
            where: {
                chatId: id,
            },
        });
        return messages;
    }
}
