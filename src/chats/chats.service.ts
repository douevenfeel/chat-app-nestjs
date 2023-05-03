import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { UsersService } from '../users/users.service';
import { forwardRef } from '@nestjs/common/utils';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/users.model';

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

    async getChatById(chatId: number) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
        });
        return chat;
    }

    async getChat(userId: number, id: number) {
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
            return { id: null, messages: [], user: secondUser };
        }
        if (chat) {
            const messages = await this.messagesService.findMessagesByChat(
                chat.id
            );
            return { id: chat.id, messages, user: secondUser };
        }
    }

    async getAllChats(userId: number) {
        await this.usersService.updateLastSeen(userId);
        const chatsFirst = await this.chatRepository.findAll({
            where: {
                firstUserId: userId,
            },
        });
        const chatsSecond = await this.chatRepository.findAll({
            where: {
                secondUserId: userId,
            },
        });
        const chats = [...chatsFirst, ...chatsSecond];
        const response =
            chats &&
            chats.reduce(async (prev: any, chat: any) => {
                const chatReturn = await this.returnChat(userId, chat);
                prev.push(chatReturn);
                return prev;
            }, []);

        return response;
    }

    async returnChat(
        userId: number,
        chat: Chat
    ): Promise<
        Pick<
            User,
            'id' | 'email' | 'firstName' | 'lastName' | 'lastSeen' | 'avatar'
        >
    > {
        let id;
        if (chat.firstUserId === userId) {
            id = chat.secondUserId;
        } else {
            id = chat.firstUserId;
        }
        const secondUser = await this.usersService.getUserById(id);
        return {
            id: secondUser.id,
            email: secondUser.email,
            firstName: secondUser.firstName,
            lastName: secondUser.lastName,
            lastSeen: secondUser.lastSeen,
            avatar: secondUser.avatar,
        };
    }
}
