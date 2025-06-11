import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { CreatePocketDto } from './dtos/create-pocket.dto';
import { UpdatePocketDto } from './dtos/update-pocket.dto';
import { PocketsService } from './pockets.service';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IUserInterface } from 'src/interfaces/user.interface';
import { PocketDocument } from 'src/schemas/pocket.schema';

@UseGuards(AccessTokenGuard)
@Controller('pockets')
export class PocketsController {
  constructor(private readonly pocketService: PocketsService) {}

  @Post()
  async createPocket(
    @Body() body: CreatePocketDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<PocketDocument> {
    return await this.pocketService.createPocket(body, user);
  }

  @Patch()
  async updatePocket(
    @Body() body: UpdatePocketDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<PocketDocument> {
    return await this.pocketService.updatePocket(body, user);
  }
}
