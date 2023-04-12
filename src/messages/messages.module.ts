import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from './messages.model';

@Module({
    controllers: [MessagesController],
    providers: [MessagesService],
    imports: [SequelizeModule.forFeature([Message])],
    exports: [MessagesService],
})
export class MessagesModule {}
