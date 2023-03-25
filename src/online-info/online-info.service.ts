import { OnlineInfo } from './online-info.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class OnlineInfoService {
    constructor(
        @InjectModel(OnlineInfo) private onlineInfoRepository: typeof OnlineInfo
    ) {}

    async create(userId: number) {
        const date = Date.now();
        const onlineInfo = await this.getOnlineInfo(userId);
        if (onlineInfo) {
            return 'error';
        }

        return await this.onlineInfoRepository.create({
            isOnline: true,
            lastSeen: String(date),
            userId,
        });
    }

    // TODO метод будет вызываться через сокет в connect
    async setOnline(userId: number) {
        const date = Date.now();
        const onlineInfo = await this.getOnlineInfo(userId);
        if (!onlineInfo) {
            this.create(userId);
        }
        onlineInfo.isOnline = true;
        onlineInfo.lastSeen = String(date);
        onlineInfo.save();

        return onlineInfo;
    }

    // TODO метод будет вызываться через сокет в disconnect
    async setOffline(userId: number) {
        const date = Date.now();
        const onlineInfo = await this.getOnlineInfo(userId);
        if (!onlineInfo) {
            this.create(userId);
        }
        onlineInfo.isOnline = false;
        onlineInfo.lastSeen = String(date);
        onlineInfo.save();

        return onlineInfo;
    }

    async getOnlineInfo(userId: number) {
        const onlineInfo = await this.onlineInfoRepository.findOne({
            where: { userId },
        });

        return onlineInfo;
    }
}
