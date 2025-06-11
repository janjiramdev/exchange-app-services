import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePocketDto {
  @IsNotEmpty()
  @IsString()
  coinId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}
