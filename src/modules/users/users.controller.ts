import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IUserInterface } from 'src/interfaces/user.interface';
import { UserDocument } from 'src/schemas/user.schema';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getProfile(@CurrentUser() user: IUserInterface): Promise<UserDocument> {
    return await this.usersService.findOneById(user._id);
  }
}
