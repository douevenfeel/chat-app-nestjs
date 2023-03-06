import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @Post('/registration')
    registration(@Body() userDto: RegistrationUserDto) {
        return this.authService.registration(userDto);
    }

    // TODO
    // сделать checkout для повторного входа по токену из куки, если он валидный

    // TODO
    // перенести confirm-code.controller сюда, чтобы запросы были на /auth/email, а не /confirmCode/email и тд
}
