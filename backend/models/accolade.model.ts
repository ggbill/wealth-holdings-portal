import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Player, { IPlayer } from './player.model';

export interface IAccolade extends Document {
    name: String,
    imageUrl: String,
    player: IPlayer
    isActive: Boolean
}

const AccoladeSchema: Schema = new Schema({
    name: { type: String },
    imageUrl: { type: String },
    player: { type: Schema.Types.ObjectId, ref: Player, required: true },
    isActive: { type: Boolean }
});

export default mongoose.model<IAccolade>('Accolade', AccoladeSchema);