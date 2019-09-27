import * as mongoose from 'mongoose'
import { Schema, Document } from 'mongoose';
import Team, {ITeam} from './team.model';

export interface ISeason extends Document {
    name: String,
    location: String,
    startDate: Date,
    endDate: Date,
    teams: ITeam[];
}

const SeasonSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: Team }]
});

// Export the model and return your ISeason interface
export default mongoose.model<ISeason>('Season', SeasonSchema);