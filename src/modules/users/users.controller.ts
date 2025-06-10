import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ExternalUser } from 'src/databases/user';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getProfile(@CurrentUser() user: ExternalUser): Promise<ExternalUser> {
    return await this.usersService.findOneById(user.id);
  }
}
