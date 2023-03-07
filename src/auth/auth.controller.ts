import { ConfirmCodeService } from './../confirm-code/confirm-code.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { CreateConfirmCodeDto } from 'src/confirm-code/dto/create-confirm-code.dto';
import { ConfirmCodeDto } from 'src/confirm-code/dto/confirm-code.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private confirmCodeService: ConfirmCodeService
    ) {}

    @Post('/login')
    login(@Body() userDto: LoginUserDto) {
        return this.authService.login(userDto);
    }

    @Post('/registration')
    registration(@Body() userDto: RegistrationUserDto) {
        return this.authService.registration(userDto);
    }

    @Post('/confirm/email')
    confirmEmail(@Body() confirmCodeDto: CreateConfirmCodeDto) {
        return this.confirmCodeService.generateCode(confirmCodeDto);
    }

    @Post('/confirm/code')
    confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
        return this.confirmCodeService.confirmCode(confirmCodeDto);
    }

    // TODO
    // сделать checkout для повторного входа по токену из куки, если он валидный

    // TODO
    // сделать logout - удаление токена из бд, очистка куки

    // TODO
    // сделать сервис токенов (!)
}
