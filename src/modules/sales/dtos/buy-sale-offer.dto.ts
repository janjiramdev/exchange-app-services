import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ECurrency } from 'src/enums/balance.enum';

export class BuySaleOfferDto {
  @IsNotEmpty()
  @IsString()
  saleId: string;

  @IsNotEmpty()
  @IsEnum(ECurrency)
  currency: ECurrency;
}
