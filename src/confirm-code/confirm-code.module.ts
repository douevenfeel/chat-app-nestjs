import { EmailModule } from './../email/email.module';
import { ConfirmCode } from './confirm-code.model';
import { Module } from '@nestjs/common';
import { ConfirmCodeController } from './confirm-code.controller';
import { ConfirmCodeService } from './confirm-code.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [ConfirmCodeService],
    controllers: [ConfirmCodeController],
    imports: [
        SequelizeModule.forFeature([ConfirmCode]),
        SequelizeModule.forFeature([User]),
        EmailModule,
        UsersModule,
    ],
    exports: [ConfirmCodeService],
})
export class ConfirmCodeModule {}
