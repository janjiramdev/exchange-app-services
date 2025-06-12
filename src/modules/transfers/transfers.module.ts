import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { PocketsModule } from '../pockets/pockets.module';
import { Transfer, TransferSchema } from 'src/schemas/transfer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
    ]),
    PocketsModule,
  ],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
