import { Body } from '@nestjs/common';
import { ConfirmCodeService } from './confirm-code.service';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { CreateConfirmCodeDto } from './dto/create-confirm-code.dto';

@ApiTags('Код подтверждения')
@Controller('confirm-code')
export class ConfirmCodeController {
    constructor(private confirmCodeService: ConfirmCodeService) {}

    @Post('/email')
    email(@Body() confirmCodeDto: CreateConfirmCodeDto) {
        return this.confirmCodeService.generateCode(confirmCodeDto);
    }

    @Post('/confirm')
    confirm(@Body() confirmCodeDto: ConfirmCodeDto) {
        return this.confirmCodeService.confirm(confirmCodeDto);
    }
}
