import { Injectable } from '@nestjs/common';
import { Avatar, User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User) {}

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
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();

        users.map((user) => {
            // @ts-ignore
            delete user.dataValues.password;
        });

        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        // @ts-ignore
        delete user.dataValues.password;

        return user;
    }
}
