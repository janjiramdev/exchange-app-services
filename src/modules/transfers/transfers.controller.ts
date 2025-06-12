import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTransferDto } from './dtos/create-transfer.dto';
import { TransfersService } from './transfers.service';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IUserInterface } from 'src/interfaces/user.interface';
import { TransferDocument } from 'src/schemas/transfer.schema';

@UseGuards(AccessTokenGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post('')
  async createTrasfer(
    @Body() body: CreateTransferDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<TransferDocument> {
    return await this.transfersService.createTrasfer(body, user);
  }
}
