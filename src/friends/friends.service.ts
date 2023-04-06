import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friend } from './friends.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';
import { RequestUser } from 'src/auth/jwt-auth.guard';
import { forwardRef } from '@nestjs/common/utils';

export type FriendStatus =
    | 'possibleFriend'
    | 'outcomingRequest'
    | 'incomingRequest'
    | 'alreadyFriend';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friend) private friendRepository: typeof Friend,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) {}

    async getAllFriends(id: number, request: RequestUser) {
        let query = {};
        const ids = [];
        const { status, q, section } = request.query;
        switch (status) {
            case 'outcomingRequest':
                query = { isRequested: true, isAccepted: false };

                break;
            case 'incomingRequest':
                query = { isRequested: false, isAccepted: true };

                break;
            case 'alreadyFriend':
                query = { isRequested: true, isAccepted: true };

                break;
            default:
                throw new HttpException(
                    'Invalid status',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
        const friendsFrom = await this.friendRepository.findAll({
            where: { from: id, ...query },
        });
        const friendsTo = await this.friendRepository.findAll({
            where: { to: id, ...query },
        });
        friendsFrom &&
            friendsFrom.map((friend) => {
                ids.push(friend.to);
                return friend;
            });
        friendsTo &&
            friendsTo.map((friend) => {
                ids.push(friend.from);
                return friend;
            });
        if (ids) {
            const clearFriends = await this.usersService.getUsersByIds(ids);
            // TODO в дальнейшем прикрутить пагинацию
            console.log(clearFriends);
            const friendsToArray = await this.friendRepository.findAll({
                where: {
                    to: id,
                    ...{ isRequested: true, isAccepted: true },
                },
            });
            const friendsFromArray = await this.friendRepository.findAll({
                where: {
                    from: id,
                    ...{ isRequested: true, isAccepted: true },
                },
            });
            const incomingRequestsArray = await this.friendRepository.findAll({
                where: {
                    to: id,
                    ...{ isRequested: true, isAccepted: false },
                },
            });
            const outcomingRequestsArray = await this.friendRepository.findAll({
                where: {
                    from: id,
                    ...{ isRequested: true, isAccepted: false },
                },
            });
            return {
                counts: {
                    friends: friendsFromArray.length + friendsToArray.length,
                    onlineFriends: clearFriends.filter(
                        (friend) => friend.onlineInfo.isOnline === true
                    ).length,
                    incomingRequests: incomingRequestsArray.length,
                    outcomingRequests: outcomingRequestsArray.length,
                },
                friends: clearFriends
                    .sort(
                        (
                            { firstName: firstNameA }: User,
                            { firstName: firstNameB }: User
                        ) => {
                            if (firstNameA < firstNameB) {
                                return -1;
                            }
                            if (firstNameA > firstNameB) {
                                return 1;
                            }
                            return 0;
                        }
                    )
                    .map((friend) => {
                        // @ts-ignore
                        friend.dataValues.friendStatus = status;
                        return friend;
                    }),
            };
        }
        return [];
    }

    async updateFriendStatus(userId: number, id: number) {
        if (userId == id) {
            throw new HttpException(
                'Requesting user and accepting user are the same person',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        console.log(userId, id);
        const candidate = await this.friendRepository.findOne({
            where: {
                from: [userId, id],
                to: [userId, id],
            },
        });
        console.log(candidate);
        if (!candidate) {
            await this.friendRepository.create({ from: userId, to: id });
            return { id, friendStatus: 'outcomingRequest' };
        }
        if (candidate.from === userId) {
            candidate.isRequested = !candidate.isRequested;
            candidate.save();
            if (candidate.isRequested && candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 'alreadyFriend' };
            }
            if (candidate.isRequested && !candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 'outcomingRequest' };
            }
            if (!candidate.isRequested && candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 'incomingRequest' };
            }
            if (!candidate.isRequested && !candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 'possibleFriend' };
            }
        } else if (candidate.to === userId) {
            candidate.isAccepted = !candidate.isAccepted;
            candidate.save();
            if (candidate.isRequested && candidate.isAccepted) {
                return { id: candidate.from, friendStatus: 'alreadyFriend' };
            }
            if (candidate.isRequested && !candidate.isAccepted) {
                return { id: candidate.from, friendStatus: 'incomingRequest' };
            }
            if (!candidate.isRequested && candidate.isAccepted) {
                return { id: candidate.from, friendStatus: 'outcomingRequest' };
            }
            if (!candidate.isRequested && !candidate.isAccepted) {
                return { id: candidate.from, friendStatus: 'possibleFriend' };
            }
        }
    }

    async getFriendStatus(userId: number, id: number) {
        const candidateFrom = await this.friendRepository.findOne({
            where: { from: userId, to: id },
        });
        if (candidateFrom) {
            if (candidateFrom.isRequested && candidateFrom.isAccepted) {
                return 'alreadyFriend';
            } else if (candidateFrom.isRequested && !candidateFrom.isAccepted) {
                return 'outcomingRequest';
            } else if (!candidateFrom.isRequested && candidateFrom.isAccepted) {
                return 'incomingRequest';
            }
        }
        const candidateTo = await this.friendRepository.findOne({
            where: { to: userId, from: id },
        });
        if (candidateTo) {
            if (candidateTo.isRequested && candidateTo.isAccepted) {
                return 'alreadyFriend';
            } else if (candidateTo.isRequested && !candidateTo.isAccepted) {
                return 'incomingRequest';
            } else if (!candidateTo.isRequested && candidateTo.isAccepted) {
                return 'outcomingRequest';
            }
        }

        return 'possibleFriend';
    }
}
