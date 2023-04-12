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
import { Chat } from 'src/chats/chats.model';

interface ChatMembersCreationAttrs {
    userId: number;
    chatId: number;
}

@Table({ tableName: 'chatMembers' })
export class ChatMembers extends Model<ChatMembers, ChatMembersCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        example: '1',
        description: 'Уникальный идентификатор записи пользователя участника',
    })
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;

    @ApiProperty({
        example: '1',
        description:
            'Уникальный идентификатор чата, в котором состоит участник',
    })
    @ForeignKey(() => Chat)
    @Column
    chatId: number;

    @BelongsTo(() => Chat, 'chatId')
    chat: Chat;
}
