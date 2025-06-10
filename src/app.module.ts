import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { UsersModule } from './modules/users/users.module';
import systemConfig from './configs/system';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [systemConfig],
    }),
    AuthModule,
    SystemModule,
    UsersModule,
  ],
})
export class AppModule {}
