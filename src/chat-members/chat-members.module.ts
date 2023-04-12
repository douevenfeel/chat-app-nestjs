import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatMembers } from './chat-members.model';

@Module({
    controllers: [ChatMembersController],
    providers: [ChatMembersService],
    imports: [
        SequelizeModule.forFeature([ChatMembers]),
        forwardRef(() => ChatsModule),
    ],
    exports: [ChatMembersService],
})
export class ChatMembersModule {}
