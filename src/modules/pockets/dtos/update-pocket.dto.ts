import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdatePocketDto {
  @IsNotEmpty()
  @IsString()
  pocketId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}
