import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friend } from './friends.model';
import { RequestUser } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friend) private friendRepository: typeof Friend,
        private usersService: UsersService
    ) {}

    async getFriends(request: RequestUser) {
        const { id } = request.user;
        return await this.getAllFriends(id);
    }

    async addFriend(request: RequestUser, to: number) {
        const { id } = request.user;
        if (id === to) {
            // TODO обработать
            return 'error';
        }
        const candidate = await this.usersService.getUserById(to);
        if (!candidate) {
            // TODO обработать
            return 'error';
        }
        const friendRequest = await this.friendRepository.findOne({
            where: { from: [id, to], to: [id, to] },
        });
        if (friendRequest) {
            if (friendRequest.from === id) {
                friendRequest.isRequested = true;
            } else {
                friendRequest.isAccepted = true;
            }
            friendRequest.save();
        } else {
            await this.friendRepository.create({
                from: id,
                to,
            });
        }
        return { friendStatus: 'cancel' };
    }

    async acceptFriendRequest(request: RequestUser, to: number) {
        const { id } = request.user;
        if (id === to) {
            // TODO обработать
            return 'error';
        }
        const candidate = await this.usersService.getUserById(to);
        if (!candidate) {
            // TODO обработать
            return 'error';
        }
        const friendRequest = await this.friendRepository.findOne({
            where: { from: [id, to], to: [id, to] },
        });
        if (!friendRequest) {
            // TODO обработать
            return 'error';
        }
        if (friendRequest.from === id) {
            friendRequest.isRequested = true;
        } else {
            friendRequest.isAccepted = true;
        }
        friendRequest.save();
        return { friendStatus: 'delete' };
    }

    async cancelFriendRequest(request: RequestUser, to: number) {
        const { id } = request.user;
        if (id === to) {
            // TODO обработать
            return 'error';
        }
        const candidate = await this.usersService.getUserById(to);
        if (!candidate) {
            // TODO обработать
            return 'error';
        }
        const friendRequest = await this.friendRepository.findOne({
            where: { from: [id, to], to: [id, to] },
        });
        if (!friendRequest) {
            // TODO обработать
            return 'error';
        }
        if (friendRequest.from === id) {
            friendRequest.isRequested = false;
        } else {
            friendRequest.isAccepted = false;
        }
        friendRequest.save();
        if (!friendRequest.isAccepted && !friendRequest.isRequested) {
            friendRequest.destroy();
        }
        return { friendStatus: 'add' };
    }

    async deleteFriend(request: RequestUser, to: number) {
        const { id } = request.user;
        if (id === to) {
            // TODO обработать
            return 'error';
        }
        const candidate = await this.usersService.getUserById(to);
        if (!candidate) {
            // TODO обработать
            return 'error';
        }
        const friendRequest = await this.friendRepository.findOne({
            where: { from: [id, to], to: [id, to] },
        });
        if (!friendRequest) {
            // TODO обработать
            return 'error';
        }
        if (friendRequest.from === id) {
            friendRequest.isRequested = false;
        } else {
            friendRequest.isAccepted = false;
        }
        friendRequest.save();
        if (!friendRequest.isAccepted && !friendRequest.isRequested) {
            friendRequest.destroy();
        }
        return { friendStatus: 'accept' };
    }

    async getAllFriends(id: number) {
        const friendsFrom = await this.friendRepository.findAll({
            where: { from: id },
            include: [{ model: User, as: 'toUser' }],
        });
        const friendsFromUserToWithStatuses = friendsFrom.map((friend) => {
            const friendStatus = this.getFriendStatus(friend.from, friend.to);
            console.log({ user: friend.toUser, friendStatus });
            return { user: friend.toUser, friendStatus };
        });
        console.log(friendsFromUserToWithStatuses);

        const friendsTo = await this.friendRepository.findAll({
            where: { to: id },
            include: [{ model: User, as: 'fromUser' }],
        });
        const friendsToUserFromWithStatuses = friendsTo.map((friend) => {
            const friendStatus = this.getFriendStatus(friend.to, friend.from);
            console.log({ user: friend.fromUser, friendStatus });
            return { user: friend.fromUser, friendStatus };
        });
        console.log(friendsToUserFromWithStatuses);

        const friends = [
            ...friendsFromUserToWithStatuses,
            ...friendsToUserFromWithStatuses,
        ];
        // const friendsWithStatuses = friends.map((friend) => {
        //     const friendStatus = this.getFriendStatus(friend.)
        // })
        return friends;
    }

    async getFriendStatus(from, to: number) {
        const friendFrom = await this.friendRepository.findOne({
            where: { from, to },
        });
        if (friendFrom)
            if (friendFrom.isAccepted === true) return 'delete';
            else return 'cancel';
        const friendTo = await this.friendRepository.findOne({
            where: { to: from, from: to },
        });
        if (friendTo)
            if (friendTo.isAccepted === true) return 'delete';
            else return 'accept';
        return 'add';
    }
}
