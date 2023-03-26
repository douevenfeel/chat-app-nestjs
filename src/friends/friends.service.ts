import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friend } from './friends.model';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/users.model';

export type FriendStatus = 0 | 1 | 2 | 3;

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(Friend) private friendRepository: typeof Friend,
        private usersService: UsersService
    ) {}

    async getAllFriends(id: number, friendStatus: 1 | 2 | 3) {
        let status = {};
        const ids = [];
        switch (+friendStatus) {
            case 1:
                status = { isRequested: true, isAccepted: false };

                break;
            case 2:
                status = { isRequested: false, isAccepted: true };

                break;
            case 3:
                status = { isRequested: true, isAccepted: true };

                break;
            default:
                return 'error';
        }
        const friendsFrom = await this.friendRepository.findAll({
            where: { from: id, ...status },
        });
        const friendsTo = await this.friendRepository.findAll({
            where: { to: id, ...status },
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
            // TODO сортировка по имени, потом сделать разные варианты, получая query параметр
            // TODO в дальнейшем прикрутить пагинацию
            console.log(clearFriends);
            return clearFriends
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
                    friend.dataValues.friendStatus = friendStatus;
                    return friend;
                });
        }
        return [];
    }

    async addFriend(userId: number, id: number) {
        if (userId === id) {
            return 'error';
        }
        const candidate = await this.friendRepository.findOne({
            where: {
                from: [userId, id],
                to: [userId, id],
            },
        });
        if (!candidate) {
            return await this.friendRepository.create({ from: userId, to: id });
        }

        if (candidate.from === userId && candidate.isRequested !== true) {
            candidate.isRequested = true;
            candidate.save();
            if (candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 3 };
            } else {
                return { id: candidate.to, friendStatus: 1 };
            }
        } else if (candidate.to === userId && candidate.isAccepted !== true) {
            candidate.isAccepted = true;
            candidate.save();
            if (candidate.isRequested) {
                return { id: candidate.to, friendStatus: 3 };
            } else {
                return { id: candidate.to, friendStatus: 2 };
            }
        }
        return { id: candidate.to, friendStatus: 3 };
    }

    async deleteFriend(userId: number, id: number) {
        if (userId === id) {
            // TODO error
            return 'error';
        }
        const candidate = await this.friendRepository.findOne({
            where: {
                from: [userId, id],
                to: [userId, id],
            },
        });
        if (!candidate) {
            // TODO error
            return 'error';
        }

        if (candidate.from === userId && candidate.isRequested !== false) {
            candidate.isRequested = false;
            candidate.save();
            if (candidate.isAccepted) {
                return { id: candidate.to, friendStatus: 2 };
            } else {
                return { id: candidate.to, friendStatus: 0 };
            }
        } else if (candidate.to === userId && candidate.isAccepted !== false) {
            candidate.isAccepted = false;
            candidate.save();
            if (candidate.isRequested) {
                return { id: candidate.to, friendStatus: 1 };
            } else {
                return { id: candidate.to, friendStatus: 0 };
            }
        }
        return { id: candidate.to, friendStatus: 0 };
    }

    async getFriendStatus(userId: number, id: number) {
        const candidateFrom = await this.friendRepository.findOne({
            where: { from: userId, to: id },
        });
        if (candidateFrom) {
            if (candidateFrom.isRequested && candidateFrom.isAccepted) {
                return 3;
            } else if (candidateFrom.isRequested && !candidateFrom.isAccepted) {
                return 1;
            } else if (!candidateFrom.isRequested && candidateFrom.isAccepted) {
                return 2;
            }
        }
        const candidateTo = await this.friendRepository.findOne({
            where: { to: userId, from: id },
        });
        if (candidateTo) {
            if (candidateTo.isRequested && candidateTo.isAccepted) {
                return 3;
            } else if (candidateTo.isRequested && !candidateTo.isAccepted) {
                return 2;
            } else if (!candidateTo.isRequested && candidateTo.isAccepted) {
                return 1;
            }
        }

        return 0;
    }
}
