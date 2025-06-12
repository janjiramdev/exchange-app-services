import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { BalanceModule } from '../balance/balance.module';
import { PocketsModule } from '../pockets/pockets.module';
import { UsersModule } from '../users/users.module';
import { Sale, SaleSchema } from 'src/schemas/sale.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    forwardRef(() => BalanceModule),
    PocketsModule,
    UsersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
