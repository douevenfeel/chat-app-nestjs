import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';

@Module({
    controllers: [ChatsController],
    providers: [ChatsService],
    imports: [ChatMembersModule],
    exports: [ChatsService],
})
export class ChatsModule {}
