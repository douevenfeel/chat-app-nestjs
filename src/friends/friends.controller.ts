import {
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService, FriendStatus } from './friends.service';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';
import { clearConfigCache } from 'prettier';

@ApiTags('Друзья')
@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Get(':id?')
    @UseGuards(JwtAuthGuard)
    getFriends(@Param('id') id: number, @Req() request: RequestUser) {
        return this.friendsService.getAllFriends(id, request);
    }

    @Post('/add/:id')
    @UseGuards(JwtAuthGuard)
    addFriend(@Param('id') id: number, @Req() request: RequestUser) {
        const { id: userId } = request.user;
        return this.friendsService.addFriend(userId, +id);
    }

    @Post('/delete/:id')
    @UseGuards(JwtAuthGuard)
    deleteFriend(@Param('id') id: number, @Req() request: RequestUser) {
        const { id: userId } = request.user;
        return this.friendsService.deleteFriend(userId, +id);
    }
}
