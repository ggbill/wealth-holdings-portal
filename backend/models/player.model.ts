import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    firstName: String,
    surname: String,
    imageUrl: String,
    isActive: Boolean
}

const PlayerSchema: Schema = new Schema({
    firstName: { type: String },
    surname: { type: String },
    imageUrl: { type: String },
    isActive: {type: Boolean}
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);