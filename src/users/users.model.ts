import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Friend } from '../friends/friends.model';

export type Avatar =
    | 'green'
    | 'teal'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow';

interface UserCreationAttrs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    avatar: Avatar;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
    @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;
    @ApiProperty({ example: '12345678', description: 'Пароль' })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ApiProperty({ example: 'Ivanov', description: 'Фамилия' })
    @Column({ type: DataType.STRING, defaultValue: false })
    lastName: string;

    @ApiProperty({ example: 'Ivan', description: 'Имя' })
    @Column({ type: DataType.STRING, defaultValue: false })
    firstName: string;

    @ApiProperty({ example: 'pink', description: 'Цвет аватара' })
    @Column({ type: DataType.STRING })
    avatar: string;
}
