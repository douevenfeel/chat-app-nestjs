import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { forwardRef } from '@nestjs/common/utils';
import { ChatMembersService } from 'src/chat-members/chat-members.service';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chat) private chatRepository: typeof Chat,
        private chatMembersService: ChatMembersService
    ) {}

    async createPrivateChat(firstUser: number, secondUser: number) {
        const crossings = await this.chatMembersService.findSamePrivateChatOfUsers(
            firstUser,
            secondUser
        );
        if (crossings.length > 0) {
            const newChat = await this.chatRepository.create({
                isPrivate: true,
            });
            const newMemberFirst = await this.chatMembersService.createChatMember(
                firstUser,
                newChat.id
            );
            const newMemberSecond = await this.chatMembersService.createChatMember(
                secondUser,
                newChat.id
            );

            return 'created new chat';
        }
        return 'chat already exists';
    }

    async findChat(chatId: number) {
        const chat = this.chatRepository.findOne({ where: { id: chatId } });
        return chat;
    }
}
