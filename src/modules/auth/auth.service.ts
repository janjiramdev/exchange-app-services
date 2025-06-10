import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { IAuthTokenDetail, IAuthTokens } from 'src/interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EncodeUtil } from 'src/utils/encode.util';
import { ExternalUser, User } from 'src/databases/user';
import { SignupDto } from './dtos/signup.dto';
import { IInsertOneUserInput } from 'src/interfaces/user.interface';
import { plainToInstance } from 'class-transformer';
import { RefreshDto } from './dtos/refresh.dto';
import {
  CJwtExpiredErrorMessage,
  CJwtInvalidErrorMessage,
} from 'src/constants/auth.constant';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  private readonly encodeUtil: EncodeUtil;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger(AuthService.name);
    this.encodeUtil = new EncodeUtil();
  }

  async signup(input: SignupDto): Promise<ExternalUser> {
    const { username, password } = input;

    try {
      const findExistingUser =
        await this.usersService.findOneByUsername(username);
      if (findExistingUser)
        throw new BadRequestException(
          `user with username: ${username} already exits`,
        );

      const user: IInsertOneUserInput = {
        username,
        password: await this.encodeUtil.hash(password),
      };
      const insertedUser = await this.usersService.insertOne(user);

      return plainToInstance(ExternalUser, insertedUser);
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async signin(input: SigninDto): Promise<IAuthTokens> {
    const { username, password } = input;

    try {
      const user = await this.usersService.findOneByUsername(username);
      if (!user)
        throw new NotFoundException(
          `user with username: ${username} not found`,
        );

      const passwordCorrected = await this.encodeUtil.compareHashed(
        password,
        user.password,
      );
      if (!passwordCorrected) throw new BadRequestException('invalid password');

      const tokens = await this.generateTokens(user);
      await this.usersService.updateOneUserRefreshToken({
        id: user.id,
        refreshToken: await this.encodeUtil.hash(tokens.refreshToken),
      });

      return tokens;
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async signout(input: string): Promise<string> {
    try {
      const user = await this.usersService.findOneByUsername(input);
      if (!user)
        throw new NotFoundException(`user with username: ${input} not found`);

      await this.usersService.updateOneUserRefreshToken({
        id: user.id,
        refreshToken: '',
      });

      return 'signout successful';
    } catch (error: unknown) {
      if (error instanceof Error)
        this.logger.error(error.stack ? error.stack : error.message);
      else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
  async refresh(input: RefreshDto): Promise<IAuthTokens> {
    const { refreshToken } = input;

    try {
      const decodedToken: IAuthTokenDetail = await this.jwtService.verifyAsync(
        refreshToken,
        {
          ignoreExpiration: false,
          secret: this.configService.get<string>('jwt.refreshTokenSecret'),
          algorithms: ['HS512'],
        },
      );

      const user = await this.usersService.findOneByUsername(
        decodedToken.username,
      );
      if (!user)
        throw new NotFoundException(
          `user with username: ${decodedToken.sub} not found`,
        );
      else if (!user.refreshToken) throw new UnauthorizedException();

      const tokenCorrected = await this.encodeUtil.compareHashed(
        refreshToken,
        user.refreshToken,
      );
      if (!tokenCorrected) throw new UnauthorizedException('invalid session');

      const tokens = await this.generateTokens(user);
      await this.usersService.updateOneUserRefreshToken({
        id: user.id,
        refreshToken: await this.encodeUtil.hash(tokens.refreshToken),
      });

      return tokens;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.stack ? error.stack : error.message);

        if (error.message === CJwtExpiredErrorMessage)
          throw new UnauthorizedException('session expired');
        else if (error.message === CJwtInvalidErrorMessage)
          throw new UnauthorizedException('invalid session');
        else throw error;
      } else this.logger.error(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private async generateTokens(input: User): Promise<IAuthTokens> {
    const { id, username } = input;

    const accessToken = await this.jwtService.signAsync(
      { sub: id, username },
      {
        secret: this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn: this.configService.get<string>('jwt.accessTokenExpireTime'),
        algorithm: 'HS512',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: id, username },
      {
        secret: this.configService.get<string>('jwt.refreshTokenSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshTokenExpireTime'),
        algorithm: 'HS512',
      },
    );

    return { accessToken, refreshToken };
  }
}
