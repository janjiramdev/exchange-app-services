import { PickType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  id: string;
  username: string;
  password: string;
  refreshToken?: string;
}

export class ExternalUser extends PickType(User, ['id', 'username']) {
  @Exclude()
  password?: string;

  @Exclude()
  refreshToken?: string;
}

export const mockUsers: User[] = [];
