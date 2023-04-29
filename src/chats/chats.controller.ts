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

    @ApiOperation({ summary: 'поиск чата' })
    @ApiResponse({ status: 200 })
    @Post(':id')
    @UseGuards(JwtAuthGuard)
    findChat(@Param('id') id: number, @Req() request: RequestUser) {
        const { id: userId } = request.user;
        return this.chatsService.findChat(userId, +id);
    }
}
