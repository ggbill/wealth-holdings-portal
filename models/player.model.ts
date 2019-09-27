import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    firstName: String,
    surname: String,
    imageUrl: String,
}

const PlayerSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    imageUrl: { type: String },
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);