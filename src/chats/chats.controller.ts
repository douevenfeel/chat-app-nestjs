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
import { ChatsService } from './chats.service';

@ApiTags('Чаты')
@Controller('chats')
export class ChatsController {
    constructor(private chatsService: ChatsService) {}
}
