import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.model';

interface ChatCreationAttrs {
    isPrivate: boolean;
}

@Table({ tableName: 'chats' })
export class Chat extends Model<Chat, ChatCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        example: 'true',
        description:
            'Показывает, приватный ли чат (false если беседа на несколько человек)',
    })
    @Column({ type: DataType.BOOLEAN })
    isPrivate: boolean;

    @ApiProperty({ example: 'Cool chat B)', description: 'Название чата' })
    @Column({ type: DataType.STRING })
    title: string;
}
