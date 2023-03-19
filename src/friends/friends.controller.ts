import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { User } from '../users/users.model';
import { JwtAuthGuard, RequestUser } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('Друзья')
@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Get('/get')
    @UseGuards(JwtAuthGuard)
    getFriends(@Req() request: RequestUser) {
        return this.friendsService.getFriends(request);
    }

    @Post('/add/:to')
    @UseGuards(JwtAuthGuard)
    addFriend(@Req() request: RequestUser, @Param('to') to: number) {
        return this.friendsService.addFriend(request, to);
    }
}
