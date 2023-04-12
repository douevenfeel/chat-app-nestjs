import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';

@Module({
    controllers: [ChatMembersController],
    providers: [ChatMembersService],
    imports: [],
    exports: [ChatMembersService],
})
export class ChatMembersModule {}
