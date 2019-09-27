import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
    name: String,
}

const TeamSchema: Schema = new Schema({
    name: { type: String, required: true },
});

// Export the model and return your ISeason interface
export default mongoose.model<ITeam>('Team', TeamSchema);