import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CoinsModule } from './modules/coins/coins.module';
import { PocketsModule } from './modules/pockets/pockets.module';
import { SalesModule } from './modules/sales/sales.module';
import { SystemModule } from './modules/system/system.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { UsersModule } from './modules/users/users.module';
import systemConfig from './configs/system';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [systemConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BalanceModule,
    CoinsModule,
    PocketsModule,
    SalesModule,
    SystemModule,
    TransfersModule,
    UsersModule,
  ],
})
export class AppModule {}
