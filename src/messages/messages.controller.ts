import {
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';
import { MessagesService } from './messages.service';

@ApiTags('Сообщения')
@Controller('messages')
export class MessagesController {
    constructor(private messageService: MessagesService) {}
}
