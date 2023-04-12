import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
    controllers: [MessagesController],
    providers: [MessagesService],
    imports: [],
    exports: [MessagesService],
})
export class MessagesModule {}
