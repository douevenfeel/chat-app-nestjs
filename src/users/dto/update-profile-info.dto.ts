import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileInfoDto {
    @ApiProperty({ example: 'Иван', description: 'Имя' })
    @IsString({ message: 'Должно быть строкой' })
    @MinLength(1)
    @MaxLength(12, { message: 'Имя не больше 12 символов' })
    readonly firstName: string;

    @ApiProperty({ example: 'Иванов', description: 'Фамилия' })
    @IsString({ message: 'Должно быть строкой' })
    @MinLength(1)
    @MaxLength(20, { message: 'Фамилия не больше 20 символов' })
    readonly lastName: string;
}
