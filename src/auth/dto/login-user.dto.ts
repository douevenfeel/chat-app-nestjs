import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: 'Некорректный email' })
    readonly email: string;

    @ApiProperty({ example: '12345', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @MinLength(4, {
        message: 'Пароль должен быть не меньше 4 символов',
    })
    @MaxLength(20, {
        message: 'Пароль должен быть не больше 20 символов',
    })
    // TODO подправить везде валидацию на такую
    readonly password: string;
}
