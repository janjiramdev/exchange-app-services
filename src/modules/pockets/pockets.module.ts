import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PocketsController } from './pockets.controller';
import { PocketsService } from './pockets.service';
import { CoinsModule } from '../coins/coins.module';
import { Pocket, PocketSchema } from 'src/schemas/pocket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pocket.name, schema: PocketSchema }]),
    CoinsModule,
  ],
  controllers: [PocketsController],
  providers: [PocketsService],
  exports: [PocketsService],
})
export class PocketsModule {}
