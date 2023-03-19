import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UsersService } from '../users/users.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { Friend } from './friends.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [FriendsController],
    providers: [FriendsService],
    imports: [
        UsersModule,
        SequelizeModule.forFeature([Friend]),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h',
            },
        }),
    ],
})
export class FriendsModule {}
