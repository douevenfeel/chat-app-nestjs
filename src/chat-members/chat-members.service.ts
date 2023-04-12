import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatMembers } from './chat-members.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { forwardRef } from '@nestjs/common/utils';
import { ChatsService } from 'src/chats/chats.service';

@Injectable()
export class ChatMembersService {
    constructor(
        @InjectModel(ChatMembers)
        private chatMemberRepository: typeof ChatMembers,
        private chatService: ChatsService
    ) {}

    async findSamePrivateChatOfUsers(firstUser: number, secondUser: number) {
        const chatsOfFirstUser = await this.chatMemberRepository.findAll({
            where: { userId: firstUser },
        });
        const chatsOfSecondUser = await this.chatMemberRepository.findAll({
            where: { userId: secondUser },
        });
        const crossings = [];
        for (let i = 0; i < chatsOfFirstUser.length; i++)
            for (let j = 0; j < chatsOfSecondUser.length; j++)
                if (
                    chatsOfSecondUser[j].chatId ===
                        chatsOfFirstUser[i].chatId &&
                    (
                        await this.chatService.findChat(
                            chatsOfFirstUser[i].chatId
                        )
                    ).isPrivate
                ) {
                    crossings.push(chatsOfFirstUser[i], chatsOfSecondUser[j]);
                }
        return crossings;
    }

    async createChatMember(userId: number, chatId: number) {
        const newMember = await this.chatMemberRepository.create({
            userId,
            chatId,
        });
        return newMember;
    }
}
