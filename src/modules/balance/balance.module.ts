import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { SalesModule } from '../sales/sales.module';
import { UsersModule } from '../users/users.module';
import { Balance, BalanceSchema } from 'src/schemas/balance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Balance.name, schema: BalanceSchema }]),
    forwardRef(() => SalesModule),
    UsersModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
