import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Player, { IPlayer } from './player.model';

export interface IFixturePlayer extends Document {
    player: IPlayer,
    goalCount: number,
    penaltyCount: String,
    isMotm: Boolean
}

const FixturePlayerSchema: Schema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: Player, required: true },
    goalCount: { type: Number},
    penaltyCount: { type: Number },
    isMotm: {type: Boolean, required: true}
});

export default mongoose.model<IFixturePlayer>('FixturePlayer', FixturePlayerSchema);