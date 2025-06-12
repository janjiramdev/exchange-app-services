import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { BuySaleOfferDto } from './dtos/buy-sale-offer.dto';
import { CreateSaleDto } from './dtos/create-sale.dto';

import { UpdateSaleDto } from './dtos/update.sale.dto';
import { SalesService } from './sales.service';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IUserInterface } from 'src/interfaces/user.interface';
import { SaleDocument } from 'src/schemas/sale.schema';

@UseGuards(AccessTokenGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(
    @Body() body: CreateSaleDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<SaleDocument> {
    return await this.salesService.createSale(body, user);
  }

  @Patch()
  async updateSale(
    @Body() body: UpdateSaleDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<SaleDocument> {
    return await this.salesService.updateSale(body, user);
  }

  @Post('/buy-sale-offer')
  async buySaleOffer(
    @Body() body: BuySaleOfferDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<SaleDocument> {
    return await this.salesService.buySaleOffer(body, user);
  }
}
