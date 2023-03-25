import { OnlineInfo } from './online-info.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { OnlineInfoService } from './online-info.service';

@Module({
    exports: [OnlineInfoModule, OnlineInfoService],
    providers: [OnlineInfoService],
    imports: [SequelizeModule.forFeature([OnlineInfo])],
})
export class OnlineInfoModule {}
