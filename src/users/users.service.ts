import { OnlineInfoService } from './../online-info/online-info.service';
import { UpdateProfileInfoDto } from './dto/update-profile-info.dto';
import { Injectable } from '@nestjs/common';
import { Avatar, User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { OnlineInfo } from 'src/online-info/online-info.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private onlineInfoService: OnlineInfoService
    ) {}

    async createUser(dto: CreateUserDto) {
        const colors: Avatar[] = [
            'green',
            'teal',
            'blue',
            'indigo',
            'purple',
            'pink',
            'red',
            'orange',
            'yellow',
        ];
        const avatar: Avatar = colors[Math.floor(Math.random() * 9)];
        const user = await this.userRepository.create({ ...dto, avatar });
        await this.onlineInfoService.create(user.id);
        const userWithOnlineInfo = await this.userRepository.findOne({
            where: { id: user.id },
            include: [
                {
                    model: OnlineInfo,
                    as: 'onlineInfo',
                    attributes: ['isOnline', 'lastSeen'],
                },
            ],
        });
        return userWithOnlineInfo;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: [{ model: OnlineInfo, as: 'onlineInfo' }],
        });

        users.map((user) => {
            // @ts-ignore
            delete user.dataValues.password;
        });

        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: [
                {
                    model: OnlineInfo,
                    as: 'onlineInfo',
                    attributes: ['isOnline', 'lastSeen'],
                },
            ],
        });

        return user;
    }
    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
            include: [
                {
                    model: OnlineInfo,
                    as: 'onlineInfo',
                    attributes: ['isOnline', 'lastSeen'],
                },
            ],
        });
        // TODO прикрутить статус friendsService.getFriendStatus(userId, id)

        // @ts-ignore
        delete user.dataValues.password;

        return user;
    }

    async updateProfileInfo(request: RequestUser, data: UpdateProfileInfoDto) {
        const { id } = request.user;
        const user = await this.userRepository.findOne({
            where: { id },
            include: [
                {
                    model: OnlineInfo,
                    as: 'onlineInfo',
                    attributes: ['isOnline', 'lastSeen'],
                },
            ],
        });
        // TODO по регулярке проверять, что нет цифр в дате, либо через class-validator (?)
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.save();
        }

        // @ts-ignore
        delete user.dataValues.password;

        return user;
    }

    async getUsersByIds(ids: number[]) {
        const friends = await this.userRepository.findAll({
            attributes: ['id', 'firstName', 'lastName', 'avatar'],
            where: { id: [...ids] },
            include: [
                {
                    model: OnlineInfo,
                    as: 'onlineInfo',
                    attributes: ['isOnline', 'lastSeen'],
                },
            ],
        });

        return friends;
    }
}
