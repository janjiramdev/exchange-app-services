import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  sellerPocketId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  priceUSD?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  priceTHB?: number;
}
