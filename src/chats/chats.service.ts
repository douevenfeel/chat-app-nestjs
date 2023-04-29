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

    async createPrivateChat(firstUser: number, secondUser: number) {
        // const crossings = await this.chatMembersService.findSamePrivateChatOfUsers(
        //     firstUser,
        //     secondUser
        // );
        // if (crossings.length > 0) {
        //     const newChat = await this.chatRepository.create({
        //         isPrivate: true,
        //     });
        //     const newMemberFirst = await this.chatMembersService.createChatMember(
        //         firstUser,
        //         newChat.id
        //     );
        //     const newMemberSecond = await this.chatMembersService.createChatMember(
        //         secondUser,
        //         newChat.id
        //     );
        //     return 'created new chat';
        // }
        // return 'chat already exists';
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
        if (!chat) {
            const secondUser = await this.usersService.getUserById(id);
            return { messages: [], user: secondUser };
        }
        if (chat) {
            const messages = await this.messagesService.findMessagesByChat(
                chat.id
            );
            if (chat.firstUserId === id)
                return { messages, user: chat.firstUser };
            if (chat.secondUserId === id)
                return { messages, user: chat.secondUser };
        }
    }
}
