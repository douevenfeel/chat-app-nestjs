import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.model';

interface OnlineInfoCreationAttrs {
    isOnline: boolean;
    lastSeen: string;
    userId: number;
}

@Table({ tableName: 'onlineInfos' })
export class OnlineInfo extends Model<OnlineInfo, OnlineInfoCreationAttrs> {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: 'true', description: 'Online | Offline' })
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    isOnline: boolean;

    @ApiProperty({
        example: '12345678',
        description: 'Время последней активности',
    })
    @Column({ type: DataType.STRING, allowNull: false })
    lastSeen: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, 'userId')
    user: User;
}
