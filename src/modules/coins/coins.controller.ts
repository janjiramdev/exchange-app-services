import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CreateCoinDto } from './dtos/create-coin.dto';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CoinDocument } from 'src/schemas/coin.schema';

@UseGuards(AccessTokenGuard)
@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post()
  async createOne(@Body() body: CreateCoinDto): Promise<CoinDocument> {
    return await this.coinsService.createOne(body);
  }
}
