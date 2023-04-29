import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { forwardRef } from '@nestjs/common/utils';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chat) private chatRepository: typeof Chat,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => MessagesService))
        private messagesService: MessagesService
    ) {}

    async createNewChat(firstUserId: number, secondUserId: number) {
        const newChat = await this.chatRepository.create({
            firstUserId,
            secondUserId,
        });
        return newChat;
    }

    async findChatById(chatId: number) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
        });
        return chat;
    }

    async findChat(userId: number, id: number) {
        await this.usersService.updateLastSeen(userId);
        if (userId == id) {
            throw new HttpException(
                'Requesting user and accepting user are the same person',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        const chat = await this.chatRepository.findOne({
            where: {
                firstUserId: [userId, id],
                secondUserId: [userId, id],
            },
        });
        const secondUser = await this.usersService.getUserById(id);
        if (!chat) {
            return { chatId: null, messages: [], user: secondUser };
        }
        if (chat) {
            const messages = await this.messagesService.findMessagesByChat(
                chat.id
            );
            return { chatId: chat.id, messages, user: secondUser };
        }
    }
}
