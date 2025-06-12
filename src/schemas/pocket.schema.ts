import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CoinDocument } from './coin.schema';
import { UserDocument } from './user.schema';

@Schema({ collection: 'pockets' })
export class Pocket {
  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'User',
  })
  user: UserDocument;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: true,
    nullable: false,
    ref: 'Coin',
  })
  coin: CoinDocument;

  @Prop({
    type: Number,
    unique: false,
    required: true,
    nullable: false,
    default: 0,
  })
  amount: number;

  // ----- ----- ----- Timestamp ----- ----- ----- //

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: true,
    nullable: false,
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    unique: false,
    required: false,
    nullable: true,
  })
  deletedAt?: Date;
}

export type PocketDocument = HydratedDocument<Pocket>;
export const PocketSchema = SchemaFactory.createForClass(Pocket);
