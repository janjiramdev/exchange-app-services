import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoinDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
