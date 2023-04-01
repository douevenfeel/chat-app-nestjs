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
import { FriendsService, FriendStatus } from './friends.service';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';
import { clearConfigCache } from 'prettier';
import { Friend } from './friends.model';

@ApiTags('Друзья')
@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @ApiOperation({ summary: 'Получить всех друзей' })
    @ApiResponse({ status: 200, type: [Friend] })
    @Get(':id?')
    @UseGuards(JwtAuthGuard)
    getFriends(@Param('id') id: number, @Req() request: RequestUser) {
        return this.friendsService.getAllFriends(id, request);
    }

    @ApiOperation({ summary: 'Добавить друга' })
    @ApiResponse({ status: 200 })
    @Post('/add/:id')
    @UseGuards(JwtAuthGuard)
    addFriend(@Param('id') id: number, @Req() request: RequestUser) {
        const { id: userId } = request.user;
        return this.friendsService.addFriend(userId, +id);
    }

    @ApiOperation({ summary: 'Удалить друга' })
    @ApiResponse({ status: 200 })
    @Post('/delete/:id')
    @UseGuards(JwtAuthGuard)
    deleteFriend(@Param('id') id: number, @Req() request: RequestUser) {
        const { id: userId } = request.user;
        return this.friendsService.deleteFriend(userId, +id);
    }
}
