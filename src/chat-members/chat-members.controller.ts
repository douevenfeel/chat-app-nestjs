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
import { ChatMembersService } from './chat-members.service';

@ApiTags('Участники чатов')
@Controller('chatMembers')
export class ChatMembersController {
    constructor(private chatMembersService: ChatMembersService) {}
}
