import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dtos/create-balance.dto';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IUserInterface } from 'src/interfaces/user.interface';
import { BalanceDocument } from 'src/schemas/balance.schema';

@UseGuards(AccessTokenGuard)
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  async createBalance(
    @Body() body: CreateBalanceDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<BalanceDocument> {
    return await this.balanceService.createBalance(body, user);
  }
}
