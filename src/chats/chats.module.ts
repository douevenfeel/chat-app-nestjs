import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
    controllers: [ChatsController],
    providers: [ChatsService],
    imports: [],
    exports: [ChatsService],
})
export class ChatsModule {}
