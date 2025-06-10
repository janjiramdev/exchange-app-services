import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { RefreshDto } from './dtos/refresh.dto';
import { AccessTokenGuard } from './guards/access-token-guard';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { IAuthTokens } from 'src/interfaces/auth.interface';
import { IUserInterface } from 'src/interfaces/user.interface';
import { UserDocument } from 'src/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<UserDocument> {
    return await this.authService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto): Promise<IAuthTokens> {
    return await this.authService.signin(body);
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  async signout(@CurrentUser() user: IUserInterface): Promise<string> {
    return await this.authService.signout(user.username);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto): Promise<IAuthTokens> {
    return await this.authService.refresh(body);
  }
}
