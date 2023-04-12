import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
    controllers: [ChatMembersController],
    providers: [ChatMembersService],
    imports: [ChatsModule],
    exports: [ChatMembersService],
})
export class ChatMembersModule {}
