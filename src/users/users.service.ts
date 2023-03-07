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
        const avatar: Avatar = colors[Math.round(Math.random() * 9)];
        const user = await this.userRepository.create({ ...dto, avatar });
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();

        // TODO пароль у каждого
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
        });

        return user;
    }

    async getUserById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        // TODO пароль
        return user;
    }
}
