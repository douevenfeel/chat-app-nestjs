import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';

@ApiTags('Друзья')
@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getFriends(@Req() request: RequestUser) {
        return this.friendsService.getFriends(request);
    }

    @Post('/add/:to')
    @UseGuards(JwtAuthGuard)
    addFriend(@Req() request: RequestUser, @Param('to') to: number) {
        return this.friendsService.addFriend(request, to);
    }

    @Post('/accept/:to')
    @UseGuards(JwtAuthGuard)
    acceptFriendRequest(@Req() request: RequestUser, @Param('to') to: number) {
        return this.friendsService.acceptFriendRequest(request, to);
    }

    @Post('/cancel/:to')
    @UseGuards(JwtAuthGuard)
    cancelFriendRequest(@Req() request: RequestUser, @Param('to') to: number) {
        return this.friendsService.cancelFriendRequest(request, to);
    }

    @Post('/delete/:to')
    @UseGuards(JwtAuthGuard)
    deleteFriend(@Req() request: RequestUser, @Param('to') to: number) {
        return this.friendsService.deleteFriend(request, to);
    }
}
