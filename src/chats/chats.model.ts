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
import { Message } from 'src/messages/messages.model';

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
        example: '1',
        description: 'Уникальный идентификатор первого участника чата',
    })
    @ForeignKey(() => User)
    @Column
    firstUserId: number;

    @BelongsTo(() => User, 'firstUserId')
    firstUser: User;

    @ApiProperty({
        example: '1',
        description: 'Уникальный идентификатор второго участника чата',
    })
    @ForeignKey(() => User)
    @Column
    secondUserId: number;

    @BelongsTo(() => User, 'secondUserId')
    secondUser: User;
}
