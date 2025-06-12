import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EBalanceType, ECurrency } from 'src/enums/balance.enum';

export class CreateBalanceDto {
  @IsNotEmpty()
  @IsEnum(EBalanceType)
  type: EBalanceType;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsEnum(ECurrency)
  currency: ECurrency;

  @IsOptional()
  @IsString()
  saleId?: string;
}
